const db = require("../models");
const Company = db.company;
const User = db.user;


checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
            return;
        }

        // Email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user) {
                res.status(400).send({ message: "Failed! Email is already in use!" });
                return;
            }

            next();
        });
    });
};

checkDuplicateName = (req, res, next) => {
    Company.findOne({
        name: req.body.name
    }).exec((err, company) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (company.name) {
            res.status(400).send({ message: "Failed! Company name is already in use!" });
            return;
        }

            next();
        });
};

const verify = {
    checkDuplicateUsernameOrEmail,
    checkDuplicateName
};

module.exports = verify;