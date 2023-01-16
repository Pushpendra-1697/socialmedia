const { Router } = require('express');
const jwt = require('jsonwebtoken');
const userRouter = Router();
const { UserModel } = require("../Models/user.model");
const bcrypt = require('bcrypt');
require('dotenv').config();


userRouter.get('/', async (req, res) => {
    try {
        let users = await UserModel.find();
        res.send(users);
    } catch (err) {
        console.log(err);
        res.send({ "Error": err.message });
    }
});



userRouter.post('/register', async (req, res) => {
    const { name, email, gender, password } = req.body;
    try {
        bcrypt.hash(password, Number(process.env.rounds), async (err, newPassword) => {
            if (err) {
                console.log(err);
            } else {
                const user = new UserModel({ name, password: newPassword, email, gender });
                await user.save();
                res.send({ "msg": "Registered" })
            }
        })
    } catch (err) {
        res.send({ "msg": "Error in registering user" });
        console.log(err);
    }
});

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.find({ email });
        if (user.length > 0) {
            bcrypt.compare(password, user[0]["password"], (err, results) => {
                if (results) {
                    const token = jwt.sign({ userID: user[0]["_id"] }, process.env.key);
                    res.send({ "msg": "Login Successfully", "token": token });
                } else {
                    res.send({ "msg": "Login Failed" })
                }
            });
        }else{
            res.send({ "msg": "Wrong credentials"});
        }
    } catch (err) {
        res.send({ "msg": "Error in Login" });
        console.log(err);
    }
});


module.exports = { userRouter };