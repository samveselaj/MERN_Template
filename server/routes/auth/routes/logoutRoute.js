const router = require("express").Router();

router.get('/logout', (req, res) => {
    req.logOut();
    return res.send({
        "login": "false",
        "message": "Logout successful"
    });
});

router.get("/google/logout", (req, res) => {
    req.logout();
    res.redirect(process.env.ORIGIN_DOMAIN);
});

module.exports = router;