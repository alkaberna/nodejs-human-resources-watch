const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var contractSchema = new Schema({
    from:  {
        type: Date,
        required: true
    },
    nyears: {
        type: Number,
        required: true,
        min: 1
    }
});

var salarySchema = new Schema({
    value:  {
        type: Currency,
        min: 0,
        required: true
    },
    from:  {
        type: Date,
        required: true
    }
});

var vacationSchema = new Schema({
    from:  {
        type: Date,
        required: true
    },
    ndays: {
        type: Number,
        required: true,
        min: 1
    }
});

const employeesSchema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true
    },
    team: {
        type: String
    },

    contracts: [contractSchema],
    salaries: [salarySchema],
    vacations: [vacationSchema]
});

var Employees = mongoose.model('Employees', employeesSchema);

module.exports = Employees;