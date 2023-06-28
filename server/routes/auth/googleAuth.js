require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const imoDomain = process.env.ORIGIN_DOMAIN;
const { replaceSpecialChars } = require("../../utils/replaceSpecialChars");
const GoogleUserModel = require("../../models/GoogleUserModel");

router.get("/login/success", (req, res) => {
    const generateToken = (id) => {
        return jwt.sign({ id }, process.env.GOOGLE_TOKEN_SECRET, {
            expiresIn: "12h",
        });
    };
    if (req.user && req.user.provider && req.user.provider === "google") {
        const token = generateToken(req.user.id);
        return res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            token: `Bearer ${replaceSpecialChars(token)}`,
        });
    } else {
        return res.sendStatus(401);
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    return res.json({ message: 'Successfully authenticated with Google!' });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(imoDomain);
});

module.exports = router;