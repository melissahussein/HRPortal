const db = require("../models");
let mongoose = require('mongoose');
const Payroll = db.payrolls;

exports.createPayroll = (req, res) => {
    if (!req.body.position || !req.body.company || !req.body.hourrate || !req.body.extrahourrate ) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    const payroll = new Payroll({
        position: req.body.position,
        company: req.body.company,
        hourrate: req.body.hourrate,
        extrahourrate: req.body.extrahourrate
    });
    payroll
        .save(payroll)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Payroll."
            });
        });
};

exports.findAllPayrolls = (req, res) => {
    Payroll.find({ })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving payrolls"
            });
        });
};

exports.findPayrollByCompany = (req, res) => {
    Payroll.find({ company: req.params.name })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving payrolls"
            });
        });
};

exports.findByCompanyAndPosition = (req, res) => {
    const position = req.params.position;
    const company = req.params.company;
    Payroll.findOne({ position , company })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Could not find Payroll" });
            else res.send(data);
        })

};

exports.updatePayroll = (req, res) => {
    const position = req.params.position;
    const company = req.params.name;
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    Employee.findOneAndUpdate({ position, company }, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Payroll.`
                });
            } else res.send({ message: "Payroll was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Payroll"
            });
        });
};


