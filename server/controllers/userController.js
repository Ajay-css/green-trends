import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

// token 

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// User Login

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.json({ success: false, message: "user dosen't exits" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid Credintials" })
        }
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Internal Server Error" })
    }
}

// User Register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check user already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // Validate password
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" })
        }

        // Hash password
        const salt = await bcrypt.genSalt(6);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        // Create token
        const token = createToken(user._id);

        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Internal Server Error" });
    }
}

// Admin Login

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, message: "Invalid Credintials" })
        }
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: "Internal Server Error" })
    }
}