const express = require("express");
const router = express.Router();

router.get('/logout', function (req, res, next) {
    req.logOut(req.user, function (error) {
        if (error) return next(error);
        else {
            res.send({
                "login": "false",
                "message": "Logout successful"
            });
        }
    });
});

module.exports = router;