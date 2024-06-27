const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config');
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "User not logged in" });
    }

    const token = authorization.replace("Bearer ", "");

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        console.log("Token payload:", payload);

        const { _id, exp } = payload;

        // Check token expiry
        if (Date.now() > exp * 1000) {
            return res.status(401).json({ error: "Token expired" });
        }

        try {
            const dbUser = await User.findById(_id);
            if (!dbUser) {
                return res.status(404).json({ error: "User not found" });
            }

            req.user = dbUser;
            next();
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.status(500).json({ error: "Error fetching user data" });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }
        console.error("JWT verification error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
};





