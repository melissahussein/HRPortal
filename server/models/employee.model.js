const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Employee = new Schema({
    id:String,
    firstname: String,
    lastname: String,
    company: String,
    SS: String,
    employmentstart: String,
    position: String,
    contracttype: String,
    exitdate: String,
    leavingreason: String,
    plannings: JSON,
    absences: JSON
},
    { timestamps: true }
);

module.exports = mongoose.model('employee', Employee);