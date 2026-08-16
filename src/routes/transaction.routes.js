const { Router } = require('express');
const transactionRoutes = Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/auth.middleware').authMiddleware
/*
    - Post /api/transactions/
    - Create a new transaction
*/

transactionRoutes.post("/", authMiddleware, transactionController.createTransaction);

module.exports = transactionRoutes;

