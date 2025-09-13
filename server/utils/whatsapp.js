import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendWhatsApp = async (to, message) => {
  try {
    const res = await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio sandbox number (fixed)
      to: "whatsapp:+" + to,         // eg: "whatsapp:+919876543210"
      body: message,
    });
    console.log(`✅ WhatsApp sent to ${to}, SID: ${res.sid}`);
  } catch (error) {
    console.error("❌ WhatsApp send failed:", error.message);
  }
};