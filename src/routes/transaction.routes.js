const { Router } = require('express');
const transactionRoutes = Router();
const transactionController = require('../controllers/transaction.controller');

/*
    - Post /api/transactions/
    - Create a new transaction
*/

transactionRoutes.post("/", transactionController.createTransaction);

module.exports = transactionRoutes;

