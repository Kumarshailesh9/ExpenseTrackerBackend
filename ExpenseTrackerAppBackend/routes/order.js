const express = require('express');
const orderController = require('../controller/order');
const userAuthenticate = require('../middelware/auth');

const orderRoute = express.Router();


orderRoute.get('/buyprmium',userAuthenticate.authenticate ,orderController.getOrders);

orderRoute.post('/updateprmium',userAuthenticate.authenticate, orderController.updateOrder);




module.exports = orderRoute;