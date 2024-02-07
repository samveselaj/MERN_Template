const router = require('express').Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../../../models/UserModel');
const { sendOTPVerificationEmail } = require("../../../services/sendOTPVerificationEmail");
const UserOTPVerificationModel = require("../../../models/UserOTPVerificationModel");

// router.post("/sendOTP", async (req, res) => {
// });


router.post('/sendOTP', async (req, res) => {
    try {
        const { username, otp } = req.body;
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