const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role,
        mycompany: req.body.mycompany,
        activity: req.body.activity
    });

    if (user.role != "Admin" && user.role != "LegalRepresentative" && user.role != "HRManager") {
        res.status(500).send({ message: "Error in role" });
        return;
    }
    if ((user.role == "LegalRepresentative" || user.role == "HRManager") && user.mycompany==[]) {
        res.status(500).send({ message: "Must provide company name" });
        return;
    }
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }


        else res.send({ message: "User was registered successfully!" });
    })
};

    exports.signin = (req, res) => {
        User.findOne({
            username: req.body.username
        })
            .exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }

                var passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                }

                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400
                });

                res.status(200).send({
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    mycompany: user.mycompany,
                    activity: user.activity,
                    accessToken: token
                });
            });

     
    };