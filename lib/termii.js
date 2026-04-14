/**
 * Required environment variables:
 * - TERMII_API_KEY
 * - TERMII_SENDER_ID
 */

const TERMII_SMS_ENDPOINT = "https://api.ng.termii.com/api/sms/send";

async function sendViaTermii(phone, message, channel) {
  const apiKey = process.env.TERMII_API_KEY;
  const senderId = process.env.TERMII_SENDER_ID;

  if (!apiKey || !senderId) {
    throw new Error("Missing TERMII_API_KEY or TERMII_SENDER_ID.");
  }

  if (!phone) {
    throw new Error("Missing destination phone number.");
  }

  if (!message) {
    throw new Error("Missing reminder message content.");
  }

  const response = await fetch(TERMII_SMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      to: phone,
      from: senderId,
      sms: message,
      type: "plain",
      channel,
    }),
    cache: "no-store",
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      `Termii ${channel} request failed: ${response.status} ${response.statusText}`,
    );
  }

  const requestSuccessful =
    payload?.code === "ok" || payload?.status === "success" || payload?.status === true;

  if (!requestSuccessful) {
    throw new Error(
      `Termii ${channel} rejected message: ${payload?.message || payload?.status || "Unknown error"}`,
    );
  }

  return payload;
}

export async function sendSMS(phone, message) {
  return sendViaTermii(phone, message, "generic");
}

export async function sendWhatsApp(phone, message) {
  return sendViaTermii(phone, message, "whatsapp");
}
