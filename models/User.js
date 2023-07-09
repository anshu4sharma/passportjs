const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "Username must be at least 3 characters"],
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters"],
    required: true,
  },
});

UserSchema.methods.verifyPassword = function (password) {
  return this.password === password;
};


// use select: false  to hide password from being returned in queries,


exports.User = mongoose.model("User", UserSchema);
