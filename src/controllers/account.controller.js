const accountModel = require('../models/account.model');

async function createAccount(req, res) {
  try {
    const user = req.user;
    const userId = req.user._id;

    const newAccount = new accountModel({
        user: userId,
    });

    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(500).json({ message: "Error creating account", error });
  }
}

module.exports = {
  createAccount
};