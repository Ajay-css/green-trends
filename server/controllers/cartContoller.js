import User from "../models/UserModel.js";

// Add Product to Cart

const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;
        const userData = await User.findById(userId);
        let cartData = userData.cartData;
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1;
        }
        await User.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart Successfully!" })
    } catch (error) {
        console.log(error.message)
    }
}

// update Product to Cart

const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body;
        const userData = await User.findById(userId);
        let cartData = await userData.cartData;
        cartData[itemId][size] = quantity;
        await User.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated!" })
    } catch (error) {
        console.log(error.message)
    }
}

// delete Product to Cart

const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await User.findById(userId);
        let cartData = await userData.cartData;
        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error.message)
    }
}

export { addToCart, updateCart, getCart }