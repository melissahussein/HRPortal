module.exports = app => {
    const employees = require("../controllers/employee.controller");
    var router = require("express").Router();

    router.get("/:name", employees.getRegister);

    app.use('/api/register', router);
};

