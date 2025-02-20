const Joi = require('joi');

// Define the customer schema for validation
const customerSchema = Joi.object({
    // customerID: Joi.string().required().messages({
    //     'any.required': 'Customer ID is required'
    // }),
    name: Joi.string().trim().required().messages({
        'any.required': 'Name is required'
    }),
    phone: Joi.string().min(10).required().messages({
        'any.required': 'Phone number is required',
        'string.min': 'Invalid phone number, must be at least 10 digits'
    }),
    address: Joi.string().required().messages({
        'any.required': 'Address is required'
    }),
    password: Joi.string().min(4).required().messages({
        'any.required': 'Password is required',
        'string.min': 'Password must be at least 4 characters'
    }),
});

module.exports = customerSchema;