import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDb from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App Config

const app = express();
const PORT = process.env.PORT || 3000

// database connnection

await connectDb();
connectCloudinary()

// middlewares

app.use(express.json());
app.use(cors())

// api endpoints

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (_, res) => res.send('<h1>Server is Woking Fine Machi</h1>'));
app.listen(PORT, () => console.log(`Server is Running on http://localhost:${process.env.PORT}`));