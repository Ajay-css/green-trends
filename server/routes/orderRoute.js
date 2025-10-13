import express from "express";
import authUser from "../middlewares/auth.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { placeStripeOrder, verifyStripe, placeRazorpayOrder, verifyRazorpayPayment, allOrders, userOrders, updateStatus, cancelOrder } from "../controllers/orderController.js";

const router = express.Router();

// Admin
router.post("/list", adminAuth, allOrders);
router.post("/status", adminAuth, updateStatus);

// User Orders
router.post("/userorders", authUser, userOrders);
router.post("/deleteorder", authUser, cancelOrder);

// Stripe
router.post("/stripe", authUser, placeStripeOrder);
router.post("/verifyStripe", authUser, verifyStripe);

// Razorpay
router.post("/razorpay", authUser, placeRazorpayOrder);
router.post("/verifyRazorpay", authUser, verifyRazorpayPayment);

export default router;