import express from "express";
import { placeOrder, placeStripeOrder, allOrders, userOrders, updateStatus, verifyStripe, cancelOrder } from "../controllers/orderController.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import authUser from "../middlewares/auth.js";

const orderRouter = express.Router();

// Admin Features

orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features

orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeStripeOrder)

// User Features

orderRouter.post('/userorders', authUser, userOrders)
orderRouter.post('/deleteorder', authUser, cancelOrder)

// Verify Payment

orderRouter.post('/verifyStripe' , authUser , verifyStripe)

export default orderRouter;