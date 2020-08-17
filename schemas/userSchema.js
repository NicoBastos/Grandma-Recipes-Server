const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: Number,
  username: {
    type: String,
    require: [true, "Username is required"],
  },
  email: {
    type: String,
    require: [true, "email is required"],
  },
  password: {
    type: String,
    require: [true, "Password is required"],
  },
  created: Date,
});
const User = mongoose.model("user", userSchema);
module.exports = User;
