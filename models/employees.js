const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

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

const employeesSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true
    },
    salaries: [salarySchema]
});

var Employees = mongoose.model('Employees', employeesSchema);

module.exports = Employees;