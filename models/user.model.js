const mongoose = require("mongoose");
const validateEmail = require("../helpers/helper");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, "Enter a valid email"],
    },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
