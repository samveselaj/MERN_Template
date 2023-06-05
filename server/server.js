require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 8080;

app.use(
    cors(
        {
            origin: `${process.env.ORIGIN_DOMAIN}`,
            methods: "GET,POST,PUT,DELETE",
            credentials: true
        }
    )
);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => console.log("Server is running on port " + port));