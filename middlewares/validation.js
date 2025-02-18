const Joi = require('joi');

const customerSchema = Joi.object({
    // customerID: Joi.string().required().messages({ 'any.required': 'Customer ID is required' }),
    name: Joi.string().trim().required().messages({ 'any.required': 'Name is required' }),
    phone: Joi.string().min(10).required().messages({ 'any.required': 'Phone number is required', 'string.min': 'Invalid phone number chack 10 digit' }),
    address: Joi.string().required().messages({ 'any.required': 'Address is required' }),
    password: Joi.string().min(8).required().messages({ 'any.required': 'Password is required', 'string.min': 'Password must be at least 8 characters long'})
});

module.exports = customerSchema;
