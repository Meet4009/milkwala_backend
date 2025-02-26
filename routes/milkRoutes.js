const express = require('express');
const route = express.Router();

const milkControl = require('../controllers/milkController');
const { authentication, authorize } = require('../middlewares/auth');

// Admin routes

route.post('/create/:id', authentication, authorize, milkControl.create);       // Create milk record By Buyer ID
route.put('/update/:id', authentication, authorize, milkControl.update);        // Update milk record By Object ID
route.delete('/delete/:id', authentication, authorize, milkControl.delete);     // Delete milk record By Object ID
route.get('/find/:id', authentication, authorize, milkControl.find);            // Find milk record By Buyer ID

route.get('/monthly-data/:id', authentication, authorize, milkControl.getMonthlyMilkDataById);      // Get Monthly Milk Data By Buyer ID
route.get('/monthly-sales/:id', authentication, authorize, milkControl.getMonthlySalesSummaryByID); // Get Monthly Sales Summary By Buyer ID
route.get('/monthly-data', authentication, authorize, milkControl.getMonthlyMilkData);              // Get Monthly Milk Data
route.get('/monthly-sales', authentication, authorize, milkControl.getMonthlySalesSummary);         // Get Monthly Sales Summary

module.exports = route;