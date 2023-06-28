require("dotenv").config();
const mongooseConnectDb = require("./middlewares/mongooseConnectDb");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./config/passportConfig");
const loginRoute = require("./routes/auth/login");
const signupRoute = require("./routes/auth/signup");
const logoutRoute = require("./routes/auth/logOut");
const tokenRoute = require("./routes/auth/token");
const googleAuthRoute = require("./routes/auth/googleAuth");
const verifyOTPRoute = require("./routes/auth/verifyOTP");
const resendOTPRoute = require("./routes/auth/resendOTP");
const { deleteNotVerified } = require("./utils/deleteNotVerified");

mongooseConnectDb();
deleteNotVerified();

const port = process.env.PORT || 8080;

app.use(cors({
    origin: `${process.env.ORIGIN_DOMAIN}`,
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '350mb',
    extended: true,
    parameterLimit: 1000000
}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", signupRoute);
app.use("/auth", loginRoute);
app.use("/auth", logoutRoute);
app.use("/auth", tokenRoute);
app.use("/auth", googleAuthRoute);
app.use("/auth", verifyOTPRoute);
app.use("/auth", resendOTPRoute);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

app.listen(port, () => console.log("Server is running on port " + port));