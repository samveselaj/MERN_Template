const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
});

function fillUnfilled(next) {
    if (!this.googleId) this.googleId = false;
    next();
}

userSchema.pre('find', fillUnfilled);
userSchema.pre('findOne', fillUnfilled);

const UserModel = mongoose.model('googleUser', userSchema);
module.exports = UserModel;