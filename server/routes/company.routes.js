module.exports = app => {
    const companies = require("../controllers/company.controller");
    const employees = require("../controllers/employee.controller");
    var router = require("express").Router();

    router.get("/", companies.findAllCompanies);
    router.get("/edit/:id", companies.findCompany);
    router.get("/:name", employees.findByCompany);
    router.delete("/:id", companies.DeleteCompany);
    router.put("/:id", companies.updateCompany);
    app.use('/api/companies', router);
};

