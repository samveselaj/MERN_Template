const express = require("express");
const passport = require("../../../config/passportConfig");
const UserModel = require("../../../models/UserModel");
const jwt = require("jsonwebtoken");
const { replaceSpecialChars } = require("../../../utils/replaceSpecialChars");

const router = express.Router();

const refreshTokens = [];

router.post('/login', (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
        const generateAccessToken = (id) => {
            return jwt.sign({ id }, process.env.TOKEN_SECRET, {
                expiresIn: "15m",
            });
        };
        const generateRefreshToken = (id) => {
            return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
        };
        if (err) throw err;
        if (!user || user === "false" || user === "null") {
            return res.status(401).json({
                "status": "error",
                "error": "Invalid username or password.",
            });
        } else if (user && (!user.verified || user.verified === "false")) {
            return res.status(403).json({
                "status": "error",
                "error": "User is not verified.",
            });
        } else {
            try {
                req.logIn(user, err => {
                    const accessToken = generateAccessToken(user._id);
                    const refreshToken = generateRefreshToken(user._id);
                    refreshTokens.push(refreshToken);
                    jwt.verify(accessToken, process.env.TOKEN_SECRET, async (err, decoded) => {
                        if (err) return res.sendStatus(401);
                        try {
                            const foundUser = await UserModel.findOne({ _id: decoded.id.trim() });
                            let newUser = {
                                id: {
                                    username: foundUser.username,
                                    email: foundUser.email,
                                }
                            }
                            return res.json({
                                "login": "true",
                                "message": "Login successful",
                                "accessToken": `Bearer ${replaceSpecialChars(accessToken)}`,
                                "refreshToken": `Bearer ${replaceSpecialChars(refreshToken)}`,
                                "user": newUser
                            });
                        } catch (err) {
                            return res.sendStatus(401);
                        }
                    });
                });
            } catch (err) {
                return res.sendStatus(401);
            }
        }
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    return res.send({
        "login": "false",
        "message": "Logout successful"
    });
});

// router.get('/logout', function (req, res, next) {
//     req.logOut(function (error) {
//         if (error) return next(error);
//         else {
//             return res.send({
//                 "login": "false",
//                 "message": "Logout successful"
//             });
//         }
//     });
// });

module.exports = router;