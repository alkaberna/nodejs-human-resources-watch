const express = require('express');
const bodyParser = require('body-parser');

const employeeRouter = express.Router();

employeeRouter.use(bodyParser.json());

employeeRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the employees to you!');
})
.post((req, res, next) => {
    res.end('Will add the employee: ' + req.body.name +
        ' ' + req.body.surname);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /employees');
})
.delete((req, res, next) => {
    res.end('Deleting all employees');
});

module.exports = employeeRouter;
