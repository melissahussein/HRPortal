const db = require("../models");
let mongoose = require('mongoose');
const User = db.user;

exports.findAllUsers = (req, res) => {

    User.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users"
            });
        });
};

exports.findUser = (req, res) => {
    const { id } = req.params;
    User.findById({ _id: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found User with id " + id });
            else res.send(data);
        })

};

exports.findAdmins = (req, res) => {
    User.find({ role: "Admin" })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Admins not found" });
            else res.send(data);
        })

};


exports.getActivityCompany = (req, res) => {
    User.find({ mycompany: req.params.company }, { activity: 1 , _id:0})
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Activity not found" });
            else res.send(data);
        })

};

exports.getActivityAll = (req, res) => {
    User.find({ }, { activity: 1, _id: 0 })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Activity not found" });
            else res.send(data);
        })

};

exports.getActivityAdmins = (req, res) => {
    User.find({ role: "Admin" }, { activity: 1, _id: 0 })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Activity not found" });
            else res.send(data);
        })

};

exports.findAdmin = (req, res) => {
    const { id } = req.params;
    User.findById({ _id: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Admin with id " + id });
            else res.send(data);
        })

};

exports.DeleteUser = (req, res) => {
    const { id } = req.params;
    User.findByIdAndRemove({ _id: id }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete User with id=${id}.`
                });
            } else {
                res.send({
                    message: "User was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    User.findByIdAndUpdate({ _id: id }, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update User with id=${id}.`
                });
            } else res.send({ message: "User was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

exports.updateRole = (req, res) => {
    const lastname = req.params.lastname;
    const firstname = req.params.firstname;
    User.findOneAndUpdate({ firstname: firstname, lastname: lastname, }, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update User ${lastname} ${firstname}.`
                });
            } else res.send({ message: "User was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User " + lastname + " " + firstname
            });
        });
}

