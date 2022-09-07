const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Number,
  },
});
const User = mongoose.model("user", userSchema); // giving the name(user) and its schema of collection in mongoDB
module.exports = User;
