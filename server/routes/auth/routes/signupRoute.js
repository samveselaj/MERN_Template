const express = require("express");
const bcrypt = require("bcryptjs");
const UserModel = require("../../../models/UserModel");
const { sendOTPVerificationEmail } = require("../../../services/sendOTPVerificationEmail");

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if ((!username || (username && username.trim().length <= 0)) || (!email || (email && email.trim().length <= 0)) || (!password || (password && password.trim().length <= 0)) || (!confirmPassword || (confirmPassword && confirmPassword.trim().length <= 0))) {
        return res.json({
            status: "error",
            error: "Fill all fields"
        }).status(403);
    } else {
        try {
            const userExists = await UserModel.findOne({ username: username });
            if (userExists) {
                if (!userExists.verified) sendOTPVerificationEmail(userExists, res);
                else {
                    return res.json({
                        status: "error",
                        error: "User exists"
                    }).status(403);
                }
            } else {
                if (password && password.trim().length >= 8) {
                    if (password !== confirmPassword) {
                        return res.json({
                            status: 'error',
                            error: "one password is incorrect"
                        });
                    } else {
                        const newUser = new UserModel({
                            username: username.toLowerCase(),
                            email: email.toLowerCase(),
                            password: password,
                        });
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, async (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                const saved = await newUser.save();
                                if (saved) sendOTPVerificationEmail(saved, res);
                                else return res.sendStatus(400);
                            });
                        });
                    }
                } else {
                    return res.json({
                        status: "error",
                        error: "Password must contain at least 8 characters"
                    }).status(403);
                }
            }
        } catch (err) {
            return res.sendStatus(400);
        }
    }
});

module.exports = router;