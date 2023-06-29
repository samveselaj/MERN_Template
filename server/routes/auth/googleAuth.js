require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { replaceSpecialChars } = require("../../utils/replaceSpecialChars");
const GoogleUserModel = require("../../models/GoogleUserModel");

const googleRefreshTokens = [];

router.get("/login/success", (req, res) => {
    const generateGoogleAccessToken = (id) => {
        return jwt.sign({ id }, process.env.TOKEN_SECRET, {
            expiresIn: "15m",
        });
    };
    const generateGoogleRefreshToken = (id) => {
        return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
    };
    if (req.user && req.user.provider && req.user.provider === "google") {
        const googleAccessToken = generateGoogleAccessToken(req.user);
        const googleRefreshToken = generateGoogleRefreshToken(req.user);
        googleRefreshTokens.push(googleRefreshToken);
        jwt.verify(googleAccessToken, process.env.TOKEN_SECRET, async (err, decoded) => {
            const decodedUser = decoded.id._json;
            if (err) return res.sendStatus(401);
            else {
                const findUser = await GoogleUserModel.findOne({ googleId: decodedUser.sub });
                if (!findUser) {
                    const decodedUser = decodedUser
                    const newUser = new GoogleUserModel({
                        googleId: decodedUser.sub,
                        usernmae: decodedUser.name,
                        email: decodedUser.email,
                        picture: decodedUser.picture
                    });
                    await newUser.save();
                }
                return res.json({
                    "login": "true",
                    "message": "Login successful",
                    "accessToken": `Google ${replaceSpecialChars(googleAccessToken)}`,
                    "refreshToken": `Google ${replaceSpecialChars(googleRefreshToken)}`,
                    "user": decodedUser
                });
            }
        });
    } else {
        return res.sendStatus(401);
    }
});

router.get("/login/failed", (req, res) => {
    return res.status(401).json({
        success: false,
        message: "failure",
    });
});

router.get("/google",
    passport.authenticate("google",
        {
            scope: ["profile", "email"]
        }
    )
);

router.get("/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.ORIGIN_DOMAIN,
        failureRedirect: "/login/failed",
    })
);

router.get("/google/logout", (req, res) => {
    req.logout();
    res.redirect(process.env.ORIGIN_DOMAIN);
});

module.exports = router;