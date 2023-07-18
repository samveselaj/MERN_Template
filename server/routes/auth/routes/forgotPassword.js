const router = require('express').Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../../../models/UserModel');
const { sendOTPVerificationEmail } = require("../../../services/sendOTPVerificationEmail");

router.post('/forgot-password', async (req, res) => {
    const { username } = req.body;
    const findUser = await UserModel.findOne({ username: username });
    if (!findUser) {
        return res.json({
            status: "error",
            error: "User does not exist"
        }).status(403);
    } else {
        sendOTPVerificationEmail(findUser, res);
    }
});

router.post("/reset-password", async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    try {
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.json({
                status: "error",
                error: "User does not exist"
            }).status(403);
        } else {
            if (password !== confirmPassword) {
                return res.json({
                    status: "error",
                    error: "Passwords do not match"
                }).status(403);
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, async (err, hash) => {
                        if (err) throw err;
                        const updated = await UserModel.findByIdAndUpdate({ _id: user._id }, {
                            password: hash,
                        });
                        if (updated) {
                            return res.json({
                                status: "ok",
                                message: "Password reset successful"
                            }).status(200);
                        } else {
                            return res.json({
                                status: "error",
                                error: "Password reset failed"
                            }).status(403);
                        }
                    });
                });
            }
        }
    } catch (error) {
        return res.json({
            status: "error",
            error: "Server error"
        }).status(500);
    }
});

module.exports = router;