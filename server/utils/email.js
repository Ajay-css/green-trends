// utils/email.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Send Order Email
export const sendOrderEmail = async (order, userEmail) => {
  try {
    // Format items as HTML table
    const itemsTable = `
      <table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse; width: 100%;">
        <thead style="background-color: #f4f4f4;">
          <tr>
            <th style="text-align: left;">Product</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
              <tr>
                <td>${item.name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td>₹${item.price * item.quantity}</td>
              </tr>`
            )
            .join("")}
          <tr style="font-weight: bold;">
            <td colspan="2" style="text-align: right;">Total:</td>
            <td>₹${order.amount}</td>
          </tr>
        </tbody>
      </table>`;

    // User email
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: "✅ Thanks for your Order!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #4CAF50;">Thanks for ordering from Green Trendz</h2>
          <p>Your order has been placed successfully 🚚</p>
          <p><b>Order ID:</b> ${order._id}</p>
          ${itemsTable}
          <p style="margin-top: 20px;">We appreciate your trust ❤️<br/>- Team Green Trendz</p>
        </div>`,
    });

    // Admin email
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: "📦 New Order Received!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #FF5722;">New Order Received</h2>
          <p><b>Order ID:</b> ${order._id}</p>
          <p><b>User:</b> ${userEmail}</p>
          <p><b>Payment Method:</b> ${order.paymentMethod}</p>
          ${itemsTable}
        </div>`,
    });

    console.log("✅ Emails sent successfully via Resend");
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};