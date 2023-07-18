const router = require('express').Router();

const signupRoute = require('./routes/signupRoute');
const loginRoute = require('./routes/loginRoute');
const googleAuthRoute = require('./routes/googleAuth');
const verifyTokenRoute = require('./routes/verifyToken');
const verifyOTPRoute = require('./routes/verifyOTP');
const resendOTPRoute = require('./routes/resendOTP');
const forgotPasswordRoute = require('./routes/forgotPassword');
const logoutRoute = require('./routes/logoutRoute');

router.use('/', signupRoute);
router.use('/', loginRoute);
router.use('/', googleAuthRoute);
router.use('/', verifyTokenRoute);
router.use('/', verifyOTPRoute);
router.use('/', resendOTPRoute);
router.use('/', forgotPasswordRoute);
router.use('/', logoutRoute);

module.exports = router;