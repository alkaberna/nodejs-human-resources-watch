const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Employees = require('../models/employees');

const employeeRouter = express.Router();

employeeRouter.use(bodyParser.json());

employeeRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Employees.find({})
    .then(
        (employees) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(employees);
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.create(req.body)
    .then(
        (employee) => {
            console.log('Employee created: ', employee);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(employee);
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported here.");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.remove({})
    .then(
        (resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        },
        (err) => next(err)
    )
    .catch((err) => next(err));    
});

employeeRouter.route('/:employeeId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(employee);
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported here.");
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findByIdAndUpdate(req.params.employeeId,
        { $set: req.body }, { new: true })
    .then(
        (employee) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(employee);
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findByIdAndRemove(req.params.employeeId)
    .then(
        (resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
});

// CONTRACTS
employeeRouter.route('/:employeeId/contracts')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(employee.contracts);
            }
            else {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null) {
                employee.contracts.push(req.body);
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported here.");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null) {
                for (var i = employee.contracts.length - 1; i >= 0; i--) {
                    employee.salaries.id(employee.salaries[i]._id).remove();
                }
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));    
});

employeeRouter.route('/:employeeId/contracts/:contractId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null && employee.contracts.id(req.params.commentId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(employee.contracts.id(req.params.contractId));
            }
            else if (dish == null) {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error("Contract " + req.params.contractId + " is not found.");
                err.status = 404;
                return next(err);            
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported here.");
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null && employee.contracts.id(req.params.contractId) != null) {
                if (req.body.from) {
                    employee.contracts.id(req.params.contractId).from = req.body.from;
                }
                if (req.body.nyears) {
                    employee.contracts.id(req.params.contractId).nyears = req.body.nyears;                
                }
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else if (employee == null) {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error("Contract " + req.params.contractId + " is not found.");
                err.status = 404;
                return next(err);            
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null && employee.contracts.id(req.params.contractId) != null) {
                employee.contracts.id(req.params.contractId).remove();
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else if (employee == null) {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error("Contract " + req.params.contractId + " is not found.");
                err.status = 404;
                return next(err);            
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
});

// SALARIES
employeeRouter.route('/:employeeId/salaries')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(employee.salaries);
            }
            else {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null) {
                employee.salaries.push(req.body);
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported here.");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null) {
                for (var i = employee.salaries.length - 1; i >= 0; i--) {
                    employee.salaries.id(employee.salaries[i]._id).remove();
                }
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));    
});

employeeRouter.route('/:employeeId/salaries/:salaryId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null && employee.salaries.id(req.params.salaryId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(employee.salaries.id(req.params.salaryId));
            }
            else if (employee == null) {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error("Salary " + req.params.salaryId + " is not found.");
                err.status = 404;
                return next(err);            
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported here.");
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null && employee.salaries.id(req.params.salaryId) != null) {
                if (req.body.value) {
                    employee.salaries.id(req.params.salaryId).value = req.body.value;
                }
                if (req.body.from) {
                    employee.salaries.id(req.params.salaryId).from = req.body.from;                
                }
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else if (employee == null) {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error("Salary " + req.params.salaryId + " is not found.");
                err.status = 404;
                return next(err);            
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null && employee.salaries.id(req.params.salaryId) != null) {
                employee.salaries.id(req.params.salaryId).remove();
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else if (employee == null) {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error("Salary " + req.params.salaryId + " is not found.");
                err.status = 404;
                return next(err);            
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
});

// VACATIONS
employeeRouter.route('/:employeeId/vacations')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(employee.vacations);
            }
            else {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null) {
                employee.vacations.push(req.body);
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported here.");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null) {
                for (var i = employee.vacations.length - 1; i >= 0; i--) {
                    employee.vacations.id(employee.vacations[i]._id).remove();
                }
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));    
});

employeeRouter.route('/:employeeId/vacations/:vacationId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null && employee.vacations.id(req.params.vacationId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(employee.vacations.id(req.params.vacationId));
            }
            else if (dish == null) {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error("Vacation " + req.params.vacationId + " is not found.");
                err.status = 404;
                return next(err);            
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported here.");
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null && employee.vacations.id(req.params.vacationId) != null) {
                if (req.body.from) {
                    employee.vacations.id(req.params.vacationId).from = req.body.from;
                }
                if (req.body.ndays) {
                    employee.vacations.id(req.params.vacationId).ndays = req.body.ndays;                
                }
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else if (employee == null) {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error("Vacation " + req.params.vacationId + " is not found.");
                err.status = 404;
                return next(err);            
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Employees.findById(req.params.employeeId)
    .then(
        (employee) => {
            if (employee != null && employee.vacations.id(req.params.vacationId) != null) {
                employee.vacations.id(req.params.vacationId).remove();
                employee.save()
                .then(
                    (employee) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(employee);                
                    },
                    (err) => next(err)
                );
            }
            else if (employee == null) {
                err = new Error("Employee " + req.params.employeeId + " is not found.");
                err.status = 404;
                return next(err);
            }
            else {
                err = new Error("Vacation " + req.params.vacationId + " is not found.");
                err.status = 404;
                return next(err);            
            }
        },
        (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = employeeRouter;