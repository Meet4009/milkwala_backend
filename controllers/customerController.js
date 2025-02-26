const Customer = require('../models/customerModels');
const Milk = require('../models/milkModels');
const { customerSchema, customerUpdateSchema } = require('../middlewares/validation');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { jwtToken, setCookie } = require('../utils/jwtHelper');
const { generateCustomerID } = require('../utils/customerHelpers');

let deleteCustomer = [];

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
        const { customerID, role } = await generateCustomerID(deleteCustomer);

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
        console.error("Error in customer registration", error);
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
        console.error("Error in customer login", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// logout

exports.logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: 'Customer logged out successfully' });
    } catch (error) {
        console.error("Error in customer logout", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ customerID: 1 });
        if (customers.length === 0) {
            return res.status(200).json({ message: 'No customers' });
        }
        const totalCustomers = customers.length;
        res.status(200).json({ message: "All Customers", totalCustomers, customers });
    } catch (error) {
        console.error("Error in getting all customers", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// getsingleCustomer

exports.getsingleCustomer = async (req, res) => {
    try {
        const customer = await Customer.find({ customerID: req.params.id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer found', customer });
    } catch (error) {
        console.error("Error in getting single customer", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Update customer
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        // Find existing customer
        const existingCustomer = await Customer.findOne({ customerID: id });

        if (!existingCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Only update fields that are provided in req.body
        const updatedData = {
            name: req.body.name || existingCustomer.name,
            phone: req.body.phone || existingCustomer.phone,
            address: req.body.address || existingCustomer.address,
        };
   
        // Validate updated data
        const { error } = customerUpdateSchema.validate(updatedData);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Update customer
        const customer = await Customer.findByIdAndUpdate(existingCustomer.id, updatedData, { new: true });

        res.status(200).json({ message: 'Customer updated successfully', customer });
    } catch (error) {
        console.error("Error in updating customer", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
// delete customer
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findOneAndDelete({ customerID: id });

        // get the customer ID and push it to the deleteCustomer array
        const customerID = parseInt(customer.customerID);
        deleteCustomer.push(customerID);
        // sort the customer
        deleteCustomer.sort((a, b) => a - b);

        // delete this customer milk Data from the milk collection
        await Milk.deleteMany({ buyerID: id });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error("Error in deleting customer", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
