const express = require('express');
const route = express.Router();

const milkControl = require('../controllers/milkController');
const { authentication, authorize } = require('../middlewares/auth');

// Admin routes

route.post('/create/:id', authentication, authorize, milkControl.create);
route.get('/data/find/:id', authentication, authorize, milkControl.getMilkDataByMonth);
route.get('/sale/data/:id', authentication, authorize, milkControl.getMonthlysales);
route.get('/find', authentication, authorize, milkControl.getAllMilkData);


module.exports = route;