const mongoose = require('mongoose');

const UserOTPVerificationSchema = new mongoose.Schema({
    username: String,
    otp: String,
    createdAt: Date,
    expireAt: Date
});

const UserOTPVerificationModel = mongoose.model('UserOTPVerificationSchema', UserOTPVerificationSchema);
module.exports = UserOTPVerificationModel;