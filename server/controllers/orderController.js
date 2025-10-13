import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import { sendOrderEmail } from "../utils/email.js";
import { sendWhatsApp } from "../utils/whatsapp.js";

const deliveryCharge = 60;

// ---------- Stripe Config ----------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------- Razorpay Config ----------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---------------- CART LOGIC ----------------

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const user = await User.findById(userId);
    let cart = user.cartData || {};
    if (!cart[itemId]) cart[itemId] = {};
    cart[itemId][size] = (cart[itemId][size] || 0) + 1;
    await User.findByIdAndUpdate(userId, { cartData: cart });
    res.json({ success: true, message: "Added To Cart Successfully!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update Cart
export const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const user = await User.findById(userId);
    if (user.cartData[itemId]) {
      user.cartData[itemId][size] = quantity;
      await User.findByIdAndUpdate(userId, { cartData: user.cartData });
      res.json({ success: true, message: "Cart Updated!" });
    } else res.json({ success: false, message: "Item not found" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    res.json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- ORDER LOGIC ----------------

// ✅ Stripe Order
export const placeStripeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const line_items = items.map((item) => ({
      price_data: {
        currency: "INR",
        product_data: { name: item.name },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Add Delivery Charges
    line_items.push({
      price_data: {
        currency: "INR",
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    // Create Stripe session — but don't save order yet
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&paymentMethod=stripe&userId=${userId}&amount=${amount}`,
      cancel_url: `${origin}/verify?success=false`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Verify Stripe Payment
export const verifyStripe = async (req, res) => {
  try {
    const { success, userId, amount, address, items } = req.body;

    if (success === "true") {
      const order = new Order({
        userId,
        items,
        amount: amount + deliveryCharge,
        address,
        paymentMethod: "Stripe",
        payment: true,
        status: "Paid",
        date: Date.now(),
      });

      await order.save();
      const user = await User.findById(userId);
      await User.findByIdAndUpdate(userId, { cartData: {} });

      // Notifications (only now)
      if (user?.email) await sendOrderEmail(order, user.email);
      try {
        const phone = address?.phone?.replace(/^(\+91|91)/, "");
        if (phone)
          await sendWhatsApp("91" + phone, `💳 Hi ${address.firstName}, your Stripe order ${order._id} has been paid!`);
        if (process.env.ADMIN_PHONE) {
          const itemsList = order.items.map(i => `${i.name} x ${i.quantity}`).join(", ");
          await sendWhatsApp(process.env.ADMIN_PHONE, `💳 Stripe Order Paid!\nOrder ID: ${order._id}\nProducts: ${itemsList}\nAmount: ₹${order.amount}`);
        }
      } catch (err) {
        console.warn("⚠️ WhatsApp send failed:", err.message);
      }

      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Razorpay Order
export const placeRazorpayOrder = async (req, res) => {
  try {
    const { userId, items, amount } = req.body;

    const options = {
      amount: (amount + deliveryCharge) * 100,
      currency: "INR",
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({ success: true, razorpayOrder });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Verify Razorpay Payment
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const order = new Order({
      userId,
      items,
      amount: amount + deliveryCharge,
      address,
      paymentMethod: "Razorpay",
      payment: true,
      status: "Paid",
      date: Date.now(),
    });

    await order.save();
    const user = await User.findById(userId);
    await User.findByIdAndUpdate(userId, { cartData: {} });

    if (user?.email) await sendOrderEmail(order, user.email);

    try {
      const phone = address?.phone?.replace(/^(\+91|91)/, "");
      if (phone)
        await sendWhatsApp("91" + phone, `💳 Hi ${address.firstName}, your Razorpay order ${order._id} is paid successfully!`);
      if (process.env.ADMIN_PHONE) {
        const itemsList = order.items.map(i => `${i.name} x ${i.quantity}`).join(", ");
        await sendWhatsApp(process.env.ADMIN_PHONE, `💳 Razorpay Order Paid!\nOrder ID: ${order._id}\nProducts: ${itemsList}\nAmount: ₹${order.amount}`);
      }
    } catch (err) {
      console.warn("⚠️ WhatsApp send failed:", err.message);
    }

    res.json({ success: true, message: "Payment Verified!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Admin & User Orders
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    await Order.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order Cancelled!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};