
const Customer = require('../models/customerModels');
const customerValidation = require('../middlewares/validation');
const { hashPassword, comparePassword } = require('../utils/secure');
const { jwtToken, setCookie } = require('../utils/jwtToken');


// Customer registration
exports.register = async (req, res) => {
    try {
        const { name, phone, address, password } = req.body;

        // Validate
        const { errors } = customerValidation.validate(req.body);
        if (errors) {
            return res.status(400).json(errors);
        }

        // Generate customer ID
        const documents = await Customer.countDocuments();

        let customerID;
        let role = "customer";

        if (documents === 0) {
            customerID = String(documents).padStart(4, '0');
            role = "admin"; // First documents is admin
        } else {
            customerID = String(documents).padStart(4, '0');
        }

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
        const token = jwtToken(customerID);

        // Set cookie
        setCookie(res, token);

        res.status(200).json({ success: true, message: 'Customer logged in successfully', token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// Get customer details

exports.getCustomerDetails = async (req, res) => {
    const customerID = req.user.customerID;

    const customer = await Customer.findOne({ customerID });
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
}

// Update customer details

exports.updateCustomerDetails = async (req, res) => {
    const customerID = req.user.customerID;
    const { name, phone, address } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(customerID, { name, phone, address }, { new: true });

    if (!updatedCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(updatedCustomer);
}

// Delete customer

exports.deleteCustomer = async (req, res) => {
    const customerID = req.user.customerID;

    const deletedCustomer = await Customer.findByIdAndDelete(customerID);

    if (!deletedCustomer) {
        return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
}

// Get all customers

exports.getAllCustomers = async (req, res) => {
    const customers = await Customer.find();

    res.json(customers);
}

// Get customer orders
