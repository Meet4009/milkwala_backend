const Customer = require('../models/customerModels');

// Helper function to generate customer ID
const generateCustomerID = async (deleteCustomer) => {
    let customerID, role;

    if (deleteCustomer.length > 0) {
        customerID = deleteCustomer.shift().toString().padStart(4, '0');
        role = "customer";
    } else {
        const customers = await Customer.countDocuments();
        customerID = customers.toString().padStart(4, '0');
        role = customers === 0 ? "admin" : "customer";
    }

    return { customerID, role };
};

module.exports = { generateCustomerID };
