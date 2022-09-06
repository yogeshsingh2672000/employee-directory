const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  deparment: {
    type: String,
    required: true,
  },
});
const Employee = mongoose.model("employee", employeeSchema);
module.exports = Employee;
