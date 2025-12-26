import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")!;
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;

interface CreateOrderRequest {
  amount: number; // in INR
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.pathname.split("/").pop();

    console.log(`Razorpay action: ${action}`);

    if (action === "create-order") {
      return await handleCreateOrder(req);
    } else if (action === "verify-payment") {
      return await handleVerifyPayment(req);
    } else if (action === "get-key") {
      // Return public key for frontend
      return new Response(
        JSON.stringify({ key_id: RAZORPAY_KEY_ID }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Razorpay error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function handleCreateOrder(req: Request): Promise<Response> {
  const body: CreateOrderRequest = await req.json();
  console.log("Creating order with body:", body);

  const { amount, currency = "INR", receipt, notes } = body;

  if (!amount || amount < 1) {
    return new Response(
      JSON.stringify({ error: "Amount must be at least 1 INR" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Amount in paise (smallest currency unit)
  const amountInPaise = Math.round(amount * 100);

  const orderData = {
    amount: amountInPaise,
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
    notes: notes || {},
  };

  console.log("Sending order to Razorpay:", orderData);

  const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();
  console.log("Razorpay order response:", data);

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: data.error?.description || "Failed to create order" }),
      {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleVerifyPayment(req: Request): Promise<Response> {
  const body: VerifyPaymentRequest = await req.json();
  console.log("Verifying payment:", body);

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Verify signature
  const generatedSignature = await generateSignature(
    `${razorpay_order_id}|${razorpay_payment_id}`,
    RAZORPAY_KEY_SECRET
  );

  console.log("Generated signature:", generatedSignature);
  console.log("Received signature:", razorpay_signature);

  const isValid = generatedSignature === razorpay_signature;

  if (!isValid) {
    console.error("Signature verification failed");
    return new Response(
      JSON.stringify({ verified: false, error: "Invalid signature" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  console.log("Payment verified successfully");

  // Fetch payment details from Razorpay
  const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
  const paymentResponse = await fetch(
    `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const paymentData = await paymentResponse.json();
  console.log("Payment details:", paymentData);

  return new Response(
    JSON.stringify({
      verified: true,
      payment: {
        id: paymentData.id,
        amount: paymentData.amount / 100, // Convert back from paise
        currency: paymentData.currency,
        status: paymentData.status,
        method: paymentData.method,
        email: paymentData.email,
        contact: paymentData.contact,
      },
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

async function generateSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
