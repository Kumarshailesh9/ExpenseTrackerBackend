const express = require('express');
const premiumController = require('../controller/premium');
const userAuthenticate = require('../middelware/auth');

const premiumRoute = express.Router();

premiumRoute.get('/premium/showleaderbord',userAuthenticate.authenticate, premiumController.getPremiums);

premiumRoute.get('/user/download', userAuthenticate.authenticate, premiumController.downloadExpenses);

premiumRoute.post('/user/timesdownload', userAuthenticate.authenticate, premiumController.timesDownload);


module.exports = premiumRoute;