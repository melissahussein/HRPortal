const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Payroll = new Schema({
    position: String,
    company: String,
    hourrate: String,
    extrahourrate: String,
},);

module.exports = mongoose.model('payroll', Payroll);