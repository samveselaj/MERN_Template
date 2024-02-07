const GoogleStrategy = require('passport-google-oauth2').Strategy;
const UserModel = require("../../models/UserModel");
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const mainNodeJsDomainApi = process.env.ORIGIN_DOMAIN_API;

const strategy = new GoogleStrategy(
    {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: `${mainNodeJsDomainApi}/auth/google/callback`,
    },
    async (token, tokenSecret, profile, done) => {
        // testing
        console.log('===== GOOGLE PROFILE =======')
        console.log(profile)
        console.log('======== END ===========')
        // code
        const { id, name, photos } = profile;
        try {
            const userMatch = await UserModel.findOne({ 'googleId': id });
            if (userMatch) {
                return done(null, userMatch);
            } else {
                const newGoogleUser = new UserModel({
                    'google.googleId': id,
                    firstName: name.givenName,
                    lastName: name.familyName,
                    photos: photos
                });
                const savedUser = await newGoogleUser.save();
                return done(null, savedUser);
            }
        } catch (err) {
            console.log('Error!! trying to find user with googleId')
            console.log(err)
            return done(null, false)
        }
    }
)

module.exports = strategy
