const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const mainNodeJsDomainApi = process.env.ORIGIN_DOMAIN_API;

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await UserModel.findOne({ username: username });
        if (!user || (user && Object.keys(user).length <= 0)) return done(null, false);
        else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result === true) return done(null, user);
                else return done(null, false);
            });
        }
    } catch (err) {
        return res.sendStatus(400);
    }
}));

passport.use(new GoogleStrategy({
    session: false,
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: `${mainNodeJsDomainApi}/auth/google/callback`,
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            const findUserInDB = await UserModel.findOne({ googleId: profile.id });
            if (findUserInDB) return done(null, findUserInDB);
            else if (!findUserInDB) {
                const newUser = new UserModel({
                    googleId: profile.id,
                    email: profile.email,
                    username: profile.email,
                    password: profile.id,
                });
                const savedUser = await newUser.save();
                if (savedUser) return done(null, savedUser);
            } else return done(null, false);
        } catch (err) {
            return done(null, false);
        }
    }
));

passport.serializeUser(function (user, done) {
    if (user.googleId) done(null, user.googleId);
    else done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await UserModel.findOne({ _id: id });
        const googleUser = await UserModel.findOne({ googleId: id });
        if (user) return done(null, user);
        else if (googleUser) return done(null, googleUser);
        else return done(null, false);
    } catch (err) {
        return res.sendStatus(400);
    }
});

module.exports = passport;
