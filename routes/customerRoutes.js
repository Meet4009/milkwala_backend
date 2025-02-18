const express = require('express');

const route = express.Router();

const customerControl = require('../controllers/customerController');

const { authantication, authorize } = require('../middlewares/auth');

route.post('/register', customerControl.register);
route.post('/login', customerControl.login);
route.get('/', authantication, authorize, customerControl.getAllCustomers);

module.exports = route;