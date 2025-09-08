import Product from "../models/ProductModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add Product

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        )
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestSeller: bestSeller === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new Product(productData)
        await product.save()
        res.json({ success: true, message: "Product Added Successfully!" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// list Product

export const listProduct = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// delete Product

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Deleted Successfully!" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// get single Product

export const getSingleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        res.json({ success: true, product })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
