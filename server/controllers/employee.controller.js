const db = require("../models");
let mongoose=require('mongoose');
const Employee = db.employees;
const File = db.file;

exports.create = (req, res) => {
    if (!req.body.firstname || !req.body.lastname) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    
    const employee = new Employee({
        id: new mongoose.Types.ObjectId,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        company: req.body.company
    });
    employee
        .save(employee)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Employee."
            });
        });
};


exports.getAll = (req, res) => {

    Employee.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving employees"
            });
        });
};

exports.findAllFiles = (req, res) => {
    const id = req.params.id;
    File.find({ id})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving files"
            });
        });
};

exports.findByCompany = (req, res) => {
    Employee.find({ company: req.params.name })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving employees"
            });
        });
};

exports.getRegister = (req, res) => {
    Employee.find({ company: req.params.name })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving employees"
            });
        });
};

exports.findById = (req, res) => {
    const id = req.params.id;
    Employee.findOne({ id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Employee with id " + id });
            else res.send(data);
        })

};

exports.findPlanning = (req, res) => {
    const id = req.params.id;
    Employee.findOne({ id }, { plannings: 1, _id: 0 })
        .then(data => {
            if (data=='{}')
                res.status(404).send({ message: "Planning not found" });
            else res.send(data);
        })

};

exports.findAbsence = (req, res) => {
    const id = req.params.id;
    Employee.findOne({ id }, { absences: 1, _id: 0 })
        .then(data => {res.send(data);
        })

};

exports.findByFullname = (req, res) => {
    const firstname = req.params.firstname;
    const lastname = req.params.lastname;
    Employee.findOne({ firstname, lastname })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Employee not found" });
            else res.send(data);
        })

};


exports.update = (req, res) => {
    const id = req.params.id;
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    Employee.findOneAndUpdate({ id }, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Employee with id=${id}.`
                });
            } else res.send({ message: "Employee was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Employee with id=" + id
            });
        });
};

exports.updateFiles = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
   

    File.findOneAndUpdate({ id: req.params.id }, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update File with id=${id}.`
                });
            } else res.send({ message: "File was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating File with id=" + id
            });
        });
};


exports.Delete = (req, res) => {
    Employee.findOneAndRemove({ id: req.params.id }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Employee with id=${id}.`
                });
            } else {
                res.send({
                    message: "Employee was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Employee with id=" + id
            });
        });
};

exports.DeleteFile = (req, res) => {
    File.findOneAndRemove({ id: req.params.id }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete file with id=${id}.`
                });
            } else {
                res.send({
                    message: "File was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete File with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Employee.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Employees were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all employees."
            });
        });
};