const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Company = new Schema({
    name: String,
    LR: String,
    HR: String
});

module.exports = mongoose.model('companies', Company);