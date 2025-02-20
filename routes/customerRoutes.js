const express = require('express');

const route = express.Router();

const customerControl = require('../controllers/customerController');

const { authentication, authorize } = require('../middlewares/auth');

route.post('/register', customerControl.register);
route.post('/login', customerControl.login);
route.get('/logout', customerControl.logout);
route.get('/', authentication, authorize, customerControl.getAllCustomers);

module.exports = route;