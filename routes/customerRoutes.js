const express = require('express');

const route = express.Router();

const customerControl = require('../controllers/customerController');

const { authentication, authorize } = require('../middlewares/auth');

// Admin routes
route.post('/register', customerControl.register);
route.post('/login', customerControl.login);
route.get('/logout', customerControl.logout);
route.get('/', authentication, authorize, customerControl.getAllCustomers);
route.get('/:id', authentication, authorize, customerControl.getsingleCustomer);
route.put('/update/:id', authentication, authorize, customerControl.updateCustomer);
route.delete('/delete/:id', authentication, authorize, customerControl.deleteCustomer);

module.exports = route;