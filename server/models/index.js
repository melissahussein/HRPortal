const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.company = require("./company.model");
db.employees = require("./employee.model");
db.payrolls = require("./payroll.model");
db.file = require("./file.model");

module.exports = db;