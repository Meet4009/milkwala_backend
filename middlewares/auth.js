const jwt = require("jsonwebtoken");
const Customer = require("../models/customerModels");

exports.authantication = async (req, res, next) => {
    try {
        const token = req.cookies?.token; // Safe optional chaining
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided. Please log in." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customer = await Customer.findById(decoded.id);

        if (!customer) {
            return res.status(403).json({ message: "Unauthorized: Invalid token. Please log in again." });
        }

        req.customer = customer; // Attach full customer object, not just decoded data
        next();
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized: Invalid or expired token. Please log in again." });
    }
};

exports.authorize = (req, res, next) => {
    const role = req.customer.role;
    if (role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Unauthorized: You do not have admin privileges." });
    }
}


