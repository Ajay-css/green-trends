import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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
      ${order.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td>₹${item.price * item.quantity}</td>
        </tr>
      `).join("")}
      <tr style="font-weight: bold;">
        <td colspan="2" style="text-align: right;">Total:</td>
        <td>₹${order.amount}</td>
      </tr>
      </tbody>
        </table>`;

        // Format ordered items
        const itemsList = order.items.map(
            (item) => `${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`
        ).join("<br/>");

        // User Email
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "✅ Thanks for your Order!",
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2 style="color: #4CAF50;">Thanks for ordering from Our Website</h2>
            <p>Hi,</p>
            <p>Your order has been placed successfully. We’ll notify you once it’s shipped 🚚.</p>
      
            <h3>Order Details:</h3>
            <p><b>Order ID:</b> ${order._id}</p>
            <p><b>Address:</b> ${order.address.street}, ${order.address.city}, ${order.address.pincode}</p>

            ${itemsTable}

            <p style="margin-top: 20px;">We appreciate your trust ❤️<br/>- Team Green Trends</p>
            </div>`
        };

        // Admin Email
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: "📦 New Order Received!",
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2 style="color: #FF5722;">New Order Received</h2>
            <p><b>Order ID:</b> ${order._id}</p>
            <p><b>User:</b> ${userEmail}</p>
            <p><b>Payment Method:</b> ${order.paymentMethod}</p>
            <p><b>Address:</b> ${order.address.street}, ${order.address.city}, ${order.address.pincode}</p>

            ${itemsTable}

            <p style="margin-top: 20px; color: #555;">Please check your admin panel for full details.</p>
            </div>`
        };


        // Send both mails
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        console.log("✅ Emails sent successfully");
    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
    }
};