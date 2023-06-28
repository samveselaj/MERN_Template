const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/UserModel");
const { replaceSpecialChars } = require("../../utils/replaceSpecialChars");

const router = express.Router();

router.post('/token', (req, res) => {
    const { refreshToken } = req.body;
    const token = refreshToken && refreshToken.split(" ")[1];

    if (!token || !token.includes(token)) {
        return res.sendStatus(403);
    } else {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            try {
                const foundUser = await UserModel.findOne({
                    $or: [
                        { _id: user.id.trim() },
                        { googleId: user.id.trim() }
                    ]
                });
                let newUser = {
                    id: {
                        username: foundUser.username,
                        email: foundUser.email,
                    }
                }
                if (newUser) {
                    const accessToken = jwt.sign({ username: foundUser.username }, process.env.TOKEN_SECRET, { expiresIn: '15m' });
                    return res.json({
                        "login": "true",
                        "message": "Login successful",
                        "accessToken": `Bearer ${replaceSpecialChars(accessToken)}`,
                        "user": newUser
                    });
                } else {
                    return res.sendStatus(403);
                }
            } catch (err) {
                return res.sendStatus(403);
            }
        });
    }
});

module.exports = router;