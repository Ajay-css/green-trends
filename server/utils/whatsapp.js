import axios from "axios";

export const sendWhatsApp = async (to, message) => {
  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to, // example: "91XXXXXXXXXX"
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`✅ WhatsApp sent to ${to}`);
  } catch (error) {
    console.error("❌ WhatsApp send failed:", error.response?.data || error.message);
  }
};
