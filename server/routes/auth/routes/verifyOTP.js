const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");

const UserOTPVerificationModel = require("../../../models/UserOTPVerificationModel");
const UserModel = require("../../../models/UserModel");
const { sendOTPVerificationEmail } = require("../../../services/sendOTPVerificationEmail");

router.post('/verifyOTP', async (req, res) => {
    try {
        const { username, email, otp } = req.body;
        if (!username) {
            return res.json({
                status: "error",
                error: "No username provided"
            }).status(403);
        } else if (!otp || (otp && otp.length < 6)) {
            return res.json({
                status: "error",
                error: "Invalid OTP"
            }).status(403);
        } else {
            const UserOTPVerificationRecords = await UserOTPVerificationModel.find({ username: username });
            if (UserOTPVerificationRecords.length > 0) {
                const expireAt = UserOTPVerificationRecords[0].expireAt;
                const hashedOTP = UserOTPVerificationRecords[0].otp;
                if (expireAt < Date.now()) {
                    await UserOTPVerificationModel.deleteMany({ username: username });
                    return res.json({
                        status: "error",
                        error: "OTP expired"
                    }).status(403);
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);

                    if (validOTP) {
                        const updateUser = await UserModel.updateOne({ username: username }, { verified: true });
                        if (updateUser) {
                            await UserOTPVerificationModel.deleteMany({ username: username });
                            return res.json({
                                status: "success",
                                message: "User verified"
                            });
                        } else {
                            return res.json({
                                status: "error",
                                error: "User not verified"
                            }).status(403);
                        }
                    } else {
                        return res.json({
                            status: "error",
                            error: "Invalid OTP"
                        }).status(403);
                    }
                }
            } else {
                return res.json({
                    status: "error",
                    error: "Invalid username"
                }).status(403);
            }
        }
    } catch (err) {
        return res.json({
            status: "error",
            error: err.message
        }).status(403);
    }
});


module.exports = router;

