require("dotenv").config();
const mongoose = require("mongoose");
const mongoUri = process.env.MONGO_URI;

function mongooseConnectDb() {
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ignoreUndefined: true
        });
        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log('Connected to MongoDB');
        });
    } catch (err) {
        return false;
    }
}

module.exports = mongooseConnectDb; 