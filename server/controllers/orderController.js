import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import Stripe from "stripe";
import { sendOrderEmail } from "../utils/email.js";
import { sendWhatsApp } from "../utils/whatsapp.js";

const currency = "inr";
const deliveryCharge = 10;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------------- CART LOGIC ----------------

// Add Product to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const userData = await User.findById(userId);
    let cartData = userData.cartData || {};

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await User.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added To Cart Successfully!" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update Product in Cart
export const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await User.findById(userId);
    if (userData.cartData[itemId]) {
      userData.cartData[itemId][size] = quantity;
      await User.findByIdAndUpdate(userId, { cartData: userData.cartData });
      res.json({ success: true, message: "Cart Updated!" });
    } else {
      res.json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await User.findById(userId);
    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ---------------- ORDER LOGIC ----------------

// Place COD Order
export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const order = new Order({
      userId,
      items,
      amount: amount + deliveryCharge,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Pending",
      date: Date.now(),
    });
    await order.save();

    const user = await User.findById(userId);
    await User.findByIdAndUpdate(userId, { cartData: {} });

    // ✅ Email
    if (user?.email) await sendOrderEmail(order, user.email);

    // ✅ WhatsApp user
    const phone = address.phone?.replace(/^(\+91|91)/, "");
    if (phone) {
      const msg = `✅ Hi ${address.firstName}, your order ${order._id} has been placed successfully! Amount: ₹${order.amount}`;
      await sendWhatsApp("91" + phone, msg);
    }

    // ✅ WhatsApp admin
    if (process.env.ADMIN_PHONE) {
      const itemsList = order.items.map((i) => `${i.name} x ${i.quantity}`).join(", ");
      const adminMsg = `📦 New COD Order Alert!
Order ID: ${order._id}
Products: ${itemsList}
Name: ${address.firstName} ${address.lastName || ""}
Phone: ${address.phone || "N/A"}
Email: ${user?.email || "N/A"}
Address: ${address.street}, ${address.city}, ${address.state} - ${address.pincode}
Amount: ₹${order.amount}
Payment: COD | Pending ❌
Date: ${new Date(order.date).toLocaleString()}`;

      await sendWhatsApp(process.env.ADMIN_PHONE, adminMsg);
    }

    res.json({ success: true, message: "Order placed successfully!" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Place Stripe Order
export const placeStripeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const order = new Order({
      userId,
      items,
      amount: amount + deliveryCharge,
      address,
      paymentMethod: "Stripe",
      payment: false,
      status: "Pending",
      date: Date.now(),
    });
    await order.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${order._id}`,
      line_items,
      mode: "payment",
    });

    const user = await User.findById(userId);
    if (user?.email) await sendOrderEmail(order, user.email);

    const phone = address.phone?.replace(/^(\+91|91)/, "");
    if (phone) {
      const msg = `💳 Hi ${address.firstName}, your Stripe order ${order._id} has been placed! Amount: ₹${order.amount}`;
      await sendWhatsApp("91" + phone, msg);
    }

    if (process.env.ADMIN_PHONE) {
      const itemsList = order.items.map((i) => `${i.name} x ${i.quantity}`).join(", ");
      const adminMsg = `💳 Stripe Order Alert!
Order ID: ${order._id}
Products: ${itemsList}
Name: ${address.firstName} ${address.lastName || ""}
Phone: ${address.phone || "N/A"}
Email: ${user?.email || "N/A"}
Amount: ₹${order.amount}
Payment: Stripe | Pending ❌
Date: ${new Date(order.date).toLocaleString()}`;

      await sendWhatsApp(process.env.ADMIN_PHONE, adminMsg);
    }

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe Payment
export const verifyStripe = async (req, res) => {
  try {
    const { orderId, success, userId } = req.body;
    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      await User.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Admin: All Orders
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ date: -1 });

    const formatted = orders.map((o) => ({
      orderId: o._id,
      userName: o.userId?.name || "Unknown",
      userEmail: o.userId?.email || "N/A",
      phone: o.address?.phone || "N/A",
      address: `${o.address?.firstName || ""} ${o.address?.lastName || ""}, ${o.address?.street || ""}, ${o.address?.city || ""}, ${o.address?.state || ""} - ${o.address?.pincode || ""}`,
      amount: o.amount,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.payment ? "Paid ✅" : "Pending ❌",
      date: new Date(o.date).toLocaleString(),
      items: o.items,
      status: o.status || "Pending",
    }));

    res.json({ success: true, orders: formatted });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// User Orders
export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update Order Status
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated!" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    await Order.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order Cancelled Successfully!" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};