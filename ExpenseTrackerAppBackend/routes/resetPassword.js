const express = require('express');
const { forgotPassword, resetpassword, updatepassword } = require('../controller/resetPassword');

const passwordRoute = express.Router();

passwordRoute.post('/forgotpassword', forgotPassword);

passwordRoute.get('/password/resetpassword/:id', resetpassword);

passwordRoute.get('/password/updatepassword/:resetpasswordid', updatepassword)


module.exports = passwordRoute;