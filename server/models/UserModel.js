const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    googleId: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now()
    },
});

function fillUnfilled(next) {
    if (!this.verified) this.verified = false;
    if (!this.googleId) this.googleId = false;
    next();
}

userSchema.pre('find', fillUnfilled);
userSchema.pre('findOne', fillUnfilled);

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;