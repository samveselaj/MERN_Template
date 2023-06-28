const express = require("express");
const bcrypt = require("bcryptjs");
const UserModel = require("../../models/UserModel");
const { sendOTPVerificationEmail } = require("../../services/sendOTPVerificationEmail");
const UserOTPVerificationModel = require("../../models/UserOTPVerificationModel");

const router = express.Router();

router.post('/resendOTP', async (req, res) => {
    const { username } = req.body;
    await UserOTPVerificationModel.deleteMany({ username: username });
    if (!username) {
        return res.json({
            status: "error",
            error: "No username provided"
        }).status(403);
    } else {
        const userExists = await UserModel.findOne({ username: username });
        if (!userExists) {
            return res.json({
                status: "error",
                error: "User does not exist"
            }).status(403);
        } else {
            if (userExists.verified) {
                return res.json({
                    status: "error",
                    error: "User already verified"
                }).status(403);
            } else {
                sendOTPVerificationEmail(userExists, res);
            }
        }
    }
});

module.exports = router;