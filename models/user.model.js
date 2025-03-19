const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { validateEmail, validatePassword } = require("../helpers/helper");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 2, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validateEmail,
        message: "No'tog'ri email formate!",
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 16,
      validate: {
        validator: validatePassword,
        message:
          "Parolda kamida 8 ta belgi, katta va kichik harf, raqam hamda maxsus belgi (@$!%*?&) bo'lishi kerak!",
      },
    },
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    console.log(this.password);

    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (userPassword) {
  console.log(userPassword);
  return await bcrypt.compare(userPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
