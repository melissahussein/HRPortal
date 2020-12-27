module.exports = app => {
    const users = require("../controllers/user.controller");
    var router = require("express").Router();

    router.get("/", users.findAdmins);
    router.get("/edit/:id", users.findAdmin);
    app.use('/api/admins', router);
};

