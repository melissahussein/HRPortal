module.exports = app => {
    const users = require("../controllers/user.controller");
    var router = require("express").Router();
    
    router.get("/", users.findAllUsers);
    router.get("/edit/:id", users.findUser);
    router.get("/activity/:company", users.getActivityCompany);
    router.get("/activity", users.getActivityAll);
    router.get("/activity/of/admins", users.getActivityAdmins);
    router.delete("/:id", users.DeleteUser);
    router.put("/:id", users.updateUser);
    router.put("/update/:firstname/:lastname", users.updateRole);
    app.use('/api/users', router);
};

