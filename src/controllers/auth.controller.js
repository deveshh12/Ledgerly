const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
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
}

module.exports = {
    register: userRegisterController
};