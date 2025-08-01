// middleware/auth.js

import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ensure file path and extension are correct

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];


        if (!token) {
            return res.status(401).json({ success: false, message: "Token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ success: false, message: error.message });
    }
};
