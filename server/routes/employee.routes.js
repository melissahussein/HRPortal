module.exports = app => {
    const employees = require("../controllers/employee.controller");
    var router = require("express").Router();

    router.post("/", employees.create);
    router.get("/", employees.getAll);
    router.get("/:id", employees.findById);
    router.get("/planning/:id", employees.findPlanning);
    router.get("/absence/:id", employees.findAbsence);
    router.get("/:firstname/:lastname", employees.findByFullname);
    router.get("/files/find/:id", employees.findAllFiles);
    router.put("/files/:id", employees.updateFiles);
    router.delete("/files/:id", employees.DeleteFile);
    router.put("/:id", employees.update);
    router.delete("/:id", employees.Delete);
    router.delete("/", employees.deleteAll);
    app.use('/api/employees', router);
};

