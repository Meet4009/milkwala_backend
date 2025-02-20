const Customer = require('../models/customerModels');
const customerSchema = require('../middlewares/validation');
const { hashPassword, comparePassword } = require('../utils/secure');
const { jwtToken, setCookie } = require('../utils/jwtToken');

// Helper function to generate customer ID
const generateCustomerID = async () => {
    const documents = await Customer.countDocuments();
    let customerID = String(documents).padStart(4, '0');
    let role = documents === 0 ? "admin" : "customer";
    return { customerID, role };
};

// Customer registration
exports.register = async (req, res) => {
    try {
        const { name, phone, address, password } = req.body;

        // Validate
        const { error } = customerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Generate customer ID
        const { customerID, role } = await generateCustomerID();

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ phone });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        // Hash password
        const hashedPassword = hashPassword(password);

        // Create new customer
        const newCustomer = new Customer({ customerID, name, phone, address, password: hashedPassword, role });
        await newCustomer.save();

        res.status(201).json({ success: true, message: 'Customer registered successfully', newCustomer });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// Customer login
exports.login = async (req, res) => {
    try {
        const { customerID, password } = req.body;

        // Check if customer exists
        const customer = await Customer.findOne({ customerID });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Check if password matches
        const isMatch = comparePassword(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwtToken(customer.id);

        // Set cookie
        setCookie(res, token);

        res.status(200).json({ success: true, message: 'Customer logged in successfully', token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        console.error("Error in getting all customers:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
