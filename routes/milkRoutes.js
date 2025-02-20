const express = require('express');

const route = express.Router();

const milkControl = require('../controllers/milkController');

const { authentication, authorize } = require('../middlewares/auth');

route.post('/create/:id', authentication, authorize, milkControl.createMilkData);
route.get('/find', authentication, authorize, milkControl.getAllMilkData);
route.get('/find/:id', authentication, authorize, milkControl.getMilkDataByBuyerID);
route.get('/find/monthlydata/:id', authentication, authorize, milkControl.getMilkDataByMonth);


module.exports = route;