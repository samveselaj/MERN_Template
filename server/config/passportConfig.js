require("dotenv").config();
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
    function (accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));

// passport.serializeUser(function (user, done) {
//     if (user.googleId) done(null, user.googleId);
//     else done(null, user.id);
// });

// passport.deserializeUser(async function (id, done) {
//     console.log(id);
//     try {
//         const user = await UserModel.findOne({ _id: id });
//         if (user) return done(null, user);
//         else return done(null, false);
//     } catch (err) {
//         return res.sendStatus(400);
//     }
// });

passport.serializeUser((user, done) => {
    if (user.sub) {
        return done(null, user);
    } else {
        done(null, user.id);
    }
});

passport.deserializeUser(async function (user, done) {
    if (user.sub) {
        return done(null, user);
    } else {
        const foundUser = UserModel.findOne({ _id: id });
        if (foundUser) return done(err, foundUser);
        else return done(null, false);

    }
});

module.exports = passport;
