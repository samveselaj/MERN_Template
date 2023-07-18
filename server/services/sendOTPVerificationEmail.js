const bcrypt = require("bcryptjs");
const { sendEmail } = require("./emailService");
const UserOTPVerificationModel = require("../models/UserOTPVerificationModel");

async function sendOTPVerificationEmail({ username, email }, res) {
    try {
        const otp = `${Math.floor(Math.random() * 900000) + 100000}`;

        const mailOptions = {
            subject: "Verify your email",
            html: `<h1>Verify your email</h1><p>Enter this OTP: <b>${otp}</b></p><p>This OTP will expire in 5 minutes.</p>`,
        };

        const saltRounds = 10;

        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const newUserOTPVerification = new UserOTPVerificationModel({
            username: username,
            otp: hashedOTP,
            createdAt: Date.now(),
            expireAt: Date.now() + 5 * 60 * 1000
        });

        await newUserOTPVerification.save();
        emailObj = {
            clientEmail: email,
            subject: mailOptions.subject,
            html: mailOptions.html
        }
        sendEmail(emailObj, res);

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            status: "error",
            message: err.message
        });
    }
}

module.exports = { sendOTPVerificationEmail };