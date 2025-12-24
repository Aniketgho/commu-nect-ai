import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type EventType = "sent" | "delivered" | "read" | "clicked" | "failed";
type DeviceType = "mobile" | "desktop" | "tablet";

interface TrackEventOptions {
  event_type: EventType;
  phone_number_id?: string;
  campaign_id?: string;
  message_id?: string;
  device_type?: DeviceType;
  response_time_seconds?: number;
}

interface BatchTrackOptions {
  events: TrackEventOptions[];
}

export function useTrackAnalytics() {
  const { user } = useAuth();

  // Detect device type based on user agent
  const detectDeviceType = useCallback((): DeviceType => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return "tablet";
    }
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) {
      return "mobile";
    }
    return "desktop";
  }, []);

  // Track a single event
  const trackEvent = useCallback(
    async (options: TrackEventOptions): Promise<boolean> => {
      if (!user) {
        console.warn("Cannot track analytics: user not authenticated");
        return false;
      }

      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.access_token) {
          console.warn("Cannot track analytics: no valid session");
          return false;
        }

        const eventWithDevice = {
          ...options,
          device_type: options.device_type || detectDeviceType(),
        };

        const { data, error } = await supabase.functions.invoke("track-analytics", {
          body: eventWithDevice,
        });

        if (error) {
          console.error("Error tracking analytics:", error);
          return false;
        }

        console.log("Analytics tracked successfully:", data);
        return true;
      } catch (error) {
        console.error("Failed to track analytics:", error);
        return false;
      }
    },
    [user, detectDeviceType]
  );

  // Track multiple events in batch
  const trackBatch = useCallback(
    async (options: BatchTrackOptions): Promise<boolean> => {
      if (!user) {
        console.warn("Cannot track analytics: user not authenticated");
        return false;
      }

      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session?.session?.access_token) {
          console.warn("Cannot track analytics: no valid session");
          return false;
        }

        const eventsWithDevice = options.events.map((event) => ({
          ...event,
          device_type: event.device_type || detectDeviceType(),
        }));

        const { data, error } = await supabase.functions.invoke("track-analytics", {
          body: { events: eventsWithDevice },
        });

        if (error) {
          console.error("Error tracking batch analytics:", error);
          return false;
        }

        console.log("Batch analytics tracked successfully:", data);
        return true;
      } catch (error) {
        console.error("Failed to track batch analytics:", error);
        return false;
      }
    },
    [user, detectDeviceType]
  );

  // Convenience methods for common events
  const trackMessageSent = useCallback(
    (options?: Omit<TrackEventOptions, "event_type">) => 
      trackEvent({ event_type: "sent", ...options }),
    [trackEvent]
  );

  const trackMessageDelivered = useCallback(
    (options?: Omit<TrackEventOptions, "event_type">) =>
      trackEvent({ event_type: "delivered", ...options }),
    [trackEvent]
  );

  const trackMessageRead = useCallback(
    (options?: Omit<TrackEventOptions, "event_type">) =>
      trackEvent({ event_type: "read", ...options }),
    [trackEvent]
  );

  const trackMessageClicked = useCallback(
    (options?: Omit<TrackEventOptions, "event_type">) =>
      trackEvent({ event_type: "clicked", ...options }),
    [trackEvent]
  );

  const trackMessageFailed = useCallback(
    (options?: Omit<TrackEventOptions, "event_type">) =>
      trackEvent({ event_type: "failed", ...options }),
    [trackEvent]
  );

  return {
    trackEvent,
    trackBatch,
    trackMessageSent,
    trackMessageDelivered,
    trackMessageRead,
    trackMessageClicked,
    trackMessageFailed,
    detectDeviceType,
  };
}
