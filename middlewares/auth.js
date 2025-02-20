const jwt = require("jsonwebtoken");
const Customer = require("../models/customerModels");

exports.authentication = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customer = await Customer.findById(decoded.userId);

        if (!customer) {
            return res.status(403).json({ message: "Unauthorized: Invalid token. Please log in again." });
        }

        req.customer = customer;
        next();
    } catch (error) {
        console.error("Error in authentication:", error);
        return res.status(403).json({ message: "Unauthorized: Invalid or expired token. Please log in again." });
    }
};

exports.authorize = (req, res, next) => {
    if (req.customer.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Unauthorized: You do not have admin privileges." });
    }
};