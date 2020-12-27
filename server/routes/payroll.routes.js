module.exports = app => {
    const payrolls = require("../controllers/payroll.controller");
    var router = require("express").Router();

    router.post("/", payrolls.createPayroll);
    router.get("/", payrolls.findAllPayrolls);
    router.get("/:name", payrolls.findPayrollByCompany);
    router.get("/:position/:company", payrolls.findByCompanyAndPosition);
    router.put("/:position/:company", payrolls.updatePayroll);
    app.use('/api/payrolls', router);
};

