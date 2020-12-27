const mongoose = require("mongoose");

const User = mongoose.model(
    "users",
    new mongoose.Schema({
        firstname: String,
        lastname: String,
        username: String,
        email: String,
        password: String,
        role: String,
        mycompany: String,
        activity: JSON
    })
);

module.exports = User;