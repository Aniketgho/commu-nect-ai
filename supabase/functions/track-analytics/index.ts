import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MessageEvent {
  event_type: "sent" | "delivered" | "read" | "clicked" | "failed";
  phone_number_id?: string;
  campaign_id?: string;
  message_id?: string;
  device_type?: "mobile" | "desktop" | "tablet";
  response_time_seconds?: number;
}

interface BatchEvents {
  events: MessageEvent[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client for database operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create user client to get the authenticated user
    const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;
    console.log(`Processing analytics for user: ${userId}`);

    // Parse request body
    const body = await req.json();
    
    // Support both single event and batch events
    const events: MessageEvent[] = body.events ? body.events : [body];
    
    if (!events || events.length === 0) {
      return new Response(
        JSON.stringify({ error: "No events provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${events.length} event(s)`);

    // Validate events
    const validEventTypes = ["sent", "delivered", "read", "clicked", "failed"];
    for (const event of events) {
      if (!event.event_type || !validEventTypes.includes(event.event_type)) {
        return new Response(
          JSON.stringify({ error: `Invalid event_type: ${event.event_type}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Insert events into message_analytics table
    const analyticsRecords = events.map((event) => ({
      user_id: userId,
      event_type: event.event_type,
      phone_number_id: event.phone_number_id || null,
      campaign_id: event.campaign_id || null,
      message_id: event.message_id || null,
      device_type: event.device_type || null,
      response_time_seconds: event.response_time_seconds || null,
    }));

    const { error: insertError } = await supabaseAdmin
      .from("message_analytics")
      .insert(analyticsRecords);

    if (insertError) {
      console.error("Error inserting message analytics:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to insert analytics", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Inserted ${analyticsRecords.length} analytics record(s)`);

    // Aggregate daily stats
    const today = new Date().toISOString().split("T")[0];
    
    // Count events by type
    const eventCounts = events.reduce(
      (acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        if (event.device_type) {
          acc[`device_${event.device_type}`] = (acc[`device_${event.device_type}`] || 0) + 1;
        }
        if (event.response_time_seconds) {
          acc.total_response_time = (acc.total_response_time || 0) + event.response_time_seconds;
          acc.response_count = (acc.response_count || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    // Check if daily record exists
    const { data: existingDaily, error: fetchError } = await supabaseAdmin
      .from("daily_analytics")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching daily analytics:", fetchError);
    }

    if (existingDaily) {
      // Update existing record
      const avgResponseTime = eventCounts.response_count
        ? Math.round(
            (existingDaily.avg_response_time_seconds * existingDaily.messages_sent +
              eventCounts.total_response_time) /
              (existingDaily.messages_sent + (eventCounts.sent || 0))
          )
        : existingDaily.avg_response_time_seconds;

      const { error: updateError } = await supabaseAdmin
        .from("daily_analytics")
        .update({
          messages_sent: existingDaily.messages_sent + (eventCounts.sent || 0),
          messages_delivered: existingDaily.messages_delivered + (eventCounts.delivered || 0),
          messages_read: existingDaily.messages_read + (eventCounts.read || 0),
          messages_clicked: existingDaily.messages_clicked + (eventCounts.clicked || 0),
          messages_failed: existingDaily.messages_failed + (eventCounts.failed || 0),
          device_mobile: existingDaily.device_mobile + (eventCounts.device_mobile || 0),
          device_desktop: existingDaily.device_desktop + (eventCounts.device_desktop || 0),
          device_tablet: existingDaily.device_tablet + (eventCounts.device_tablet || 0),
          avg_response_time_seconds: avgResponseTime,
        })
        .eq("id", existingDaily.id);

      if (updateError) {
        console.error("Error updating daily analytics:", updateError);
      } else {
        console.log("Updated daily analytics");
      }
    } else {
      // Insert new daily record
      const { error: insertDailyError } = await supabaseAdmin
        .from("daily_analytics")
        .insert({
          user_id: userId,
          date: today,
          messages_sent: eventCounts.sent || 0,
          messages_delivered: eventCounts.delivered || 0,
          messages_read: eventCounts.read || 0,
          messages_clicked: eventCounts.clicked || 0,
          messages_failed: eventCounts.failed || 0,
          device_mobile: eventCounts.device_mobile || 0,
          device_desktop: eventCounts.device_desktop || 0,
          device_tablet: eventCounts.device_tablet || 0,
          avg_response_time_seconds: eventCounts.response_count
            ? Math.round(eventCounts.total_response_time / eventCounts.response_count)
            : 0,
        });

      if (insertDailyError) {
        console.error("Error inserting daily analytics:", insertDailyError);
      } else {
        console.log("Created new daily analytics record");
      }
    }

    // Update campaign analytics if campaign_id is provided
    const campaignEvents = events.filter((e) => e.campaign_id);
    if (campaignEvents.length > 0) {
      const campaignCounts = campaignEvents.reduce(
        (acc, event) => {
          const campaignId = event.campaign_id!;
          if (!acc[campaignId]) {
            acc[campaignId] = { sent: 0, delivered: 0, read: 0, clicked: 0, failed: 0 };
          }
          acc[campaignId][event.event_type] = (acc[campaignId][event.event_type] || 0) + 1;
          return acc;
        },
        {} as Record<string, Record<string, number>>
      );

      for (const [campaignId, counts] of Object.entries(campaignCounts)) {
        // Check if campaign analytics record exists for today
        const { data: existingCampaign, error: campaignFetchError } = await supabaseAdmin
          .from("campaign_analytics")
          .select("*")
          .eq("campaign_id", campaignId)
          .eq("date", today)
          .maybeSingle();

        if (campaignFetchError) {
          console.error("Error fetching campaign analytics:", campaignFetchError);
          continue;
        }

        if (existingCampaign) {
          const { error: campaignUpdateError } = await supabaseAdmin
            .from("campaign_analytics")
            .update({
              messages_sent: existingCampaign.messages_sent + (counts.sent || 0),
              messages_delivered: existingCampaign.messages_delivered + (counts.delivered || 0),
              messages_read: existingCampaign.messages_read + (counts.read || 0),
              messages_clicked: existingCampaign.messages_clicked + (counts.clicked || 0),
              messages_failed: existingCampaign.messages_failed + (counts.failed || 0),
            })
            .eq("id", existingCampaign.id);

          if (campaignUpdateError) {
            console.error("Error updating campaign analytics:", campaignUpdateError);
          }
        } else {
          const { error: campaignInsertError } = await supabaseAdmin
            .from("campaign_analytics")
            .insert({
              user_id: userId,
              campaign_id: campaignId,
              date: today,
              messages_sent: counts.sent || 0,
              messages_delivered: counts.delivered || 0,
              messages_read: counts.read || 0,
              messages_clicked: counts.clicked || 0,
              messages_failed: counts.failed || 0,
            });

          if (campaignInsertError) {
            console.error("Error inserting campaign analytics:", campaignInsertError);
          }
        }
      }
      console.log(`Updated analytics for ${Object.keys(campaignCounts).length} campaign(s)`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: events.length,
        message: "Analytics tracked successfully" 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
