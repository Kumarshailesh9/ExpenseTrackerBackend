const express = require('express');
const { getUser, postUser, postLogin } = require('../controller/user');



const userRoute = express.Router();

userRoute.get('/user/signup', getUser);

userRoute.post('/user/signup', postUser);

userRoute.post('/user/login', postLogin);

 module.exports = userRoute;