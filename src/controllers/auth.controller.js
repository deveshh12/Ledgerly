const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');
/*
  Controller function to handle user registration
  POST /api/auth/register
*/

async function userRegisterController(req, res) {
    const { email, password, name } = req.body;

    const isExists = await userModel.findOne({ email: email });

    if (isExists) {
        return res.status(422).json({ message: 'User already exists' ,
        status: "Failed",
        });
    }

    const newUser = new userModel({
        email: email,
        password: password,
        name: name
    });

    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
    res.cookie('token', token);
    res.status(201).json({
        user: {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name
        },
        token: token,
        message: 'User registered successfully',
        status: "Success",
    });

    await emailService.sendRegistrationEmail(newUser.email, newUser.name);
}

/*
  Controller function to handle user login
  POST /api/auth/login
*/

async function userLoginController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email }).select("+password");

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
    res.cookie('token', token);
    res.status(200).json({
        user: {
            id: user._id,
            email: user.email,
            name: user.name
        },
        token: token,
        message: 'User logged in successfully',
        status: "Success",
    });
}

module.exports = {
    register: userRegisterController,
    login: userLoginController,
};