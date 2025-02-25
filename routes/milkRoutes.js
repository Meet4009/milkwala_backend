const express = require('express');
const route = express.Router();

const milkControl = require('../controllers/milkController');
const { authentication, authorize } = require('../middlewares/auth');

// Admin routes

route.post('/create/:id', authentication, authorize, milkControl.create);
route.get('/monthly-data/:id', authentication, authorize, milkControl.getMonthlyMilkDataById);
route.get('/monthly-sales/:id', authentication, authorize, milkControl.getMonthlySalesSummaryByID);
route.get('/monthly-data', authentication, authorize, milkControl.getMonthlyMilkData);
route.get('/monthly-sales', authentication, authorize, milkControl.getMonthlySalesSummary);




module.exports = route;