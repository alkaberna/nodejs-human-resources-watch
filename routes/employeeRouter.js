const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Employees = require('../models/employees');

const employeeRouter = express.Router();

employeeRouter.use(bodyParser.json());

employeeRouter.route('/')
.get((req, res, next) => {
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
.post((req, res, next) => {
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
.put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported here.");
})
.delete((req, res, next) => {
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
.get((req, res, next) => {
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
.post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported here.");
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
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

module.exports = employeeRouter;