const UserModel = require("../models/UserModel");
const UserOTPVerificationModel = require("../models/UserOTPVerificationModel");

async function deleteNotVerified() {
    const users = await UserModel.find();
    const userOtps = await UserOTPVerificationModel.find();

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        for (let j = 0; j < userOtps.length; j++) {
            const userOtp = userOtps[j];
            if ((userOtp.username === user.username && userOtp.expireAt < Date.now()) || (!"verified" in user)) {
                await UserModel.deleteOne({ _id: user._id });
            }
            if (userOtp.expireAt < Date.now()) {
                await UserOTPVerificationModel.deleteOne({ _id: userOtp._id });
            }
        }
    }
}

module.exports = { deleteNotVerified };