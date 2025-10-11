// utils/whatsapp.js
import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = pkg;

let client;

export const initWhatsApp = () => {
  if (client) return client;

  client = new Client({
    authStrategy: new LocalAuth({
      clientId: "mern-ecommerce-admin",
    }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", (qr) => {
    console.log("\n📱 Scan this QR code with your ADMIN WhatsApp:");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("✅ WhatsApp connected and ready!");
  });

  client.on("auth_failure", (msg) => {
    console.error("❌ Auth failed:", msg);
  });

  client.on("disconnected", (reason) => {
    console.log("⚠️ WhatsApp disconnected:", reason);
    client.destroy();
    client = null;
    setTimeout(initWhatsApp, 5000);
  });

  client.initialize();
  return client;
};

export const sendWhatsApp = async (phone, message) => {
  try {
    const client = initWhatsApp();

    let formatted = phone.replace(/\D/g, ""); // remove non-digits
    if (!formatted.startsWith("91")) formatted = "91" + formatted;
    const chatId = formatted + "@c.us";

    await client.sendMessage(chatId, message);
    console.log(`📩 WhatsApp message sent to ${phone}`);
  } catch (error) {
    console.error("Error sending WhatsApp:", error.message);
  }
};