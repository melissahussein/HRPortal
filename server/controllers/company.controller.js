const db = require("../models");
let mongoose = require('mongoose');
const Company = db.company;
const User = db.user;

exports.findAllCompanies = (req, res) => {

    Company.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving companies"
            });
        });
};

exports.findCompany = (req, res) => {
    const { id } = req.params;
    Company.findById({ _id: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Company with id " + id });
            else res.send(data);
        })

};


exports.DeleteCompany = (req, res) => {
    const { id } = req.params;
    Company.findByIdAndRemove({ _id: id }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Companh with id=${id}.`
                });
            } else {
                res.send({
                    message: "Company was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Company with id=" + id
            });
        });
};

exports.updateCompany = (req, res) => {
    const { id } = req.params;
    Company.findByIdAndUpdate({ _id: id }, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Company with id=${id}.`
                });
            } else res.send({ message: "Company was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Company with id=" + id
            });
        });
};