const express = require("express");
const router = express.Router();

const accountModel = require("../models/account.model");
const accountController = require("../controllers/account.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js").authMiddleware;

/* 
    POST /api/accounts/ 
    Create a new account for the authenticated user.
    Protected route

*/
router.post("/", authMiddleware, accountController.createAccount);

module.exports = router;