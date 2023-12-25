const express = require('express');
const expenseController = require('../controller/expense');
const userAuthenticate = require('../middelware/auth');



const expenseRoute = express.Router();

expenseRoute.get('/expense/add-expense' ,userAuthenticate.authenticate, expenseController.getExpense);

expenseRoute.post('/expense/add-expense',userAuthenticate.authenticate, expenseController.postExpense);

expenseRoute.delete('/expense/add-expense/:id',userAuthenticate.authenticate, expenseController.deleteExpense);

module.exports = expenseRoute;