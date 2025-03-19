const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const response = require("../handlers/response");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(password);

    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    const existingUser = await User.findOne({ email });

    if (existingUser) return response(res, 400, "Email allaqachon mavjud!");

    const newUser = new User({ name, email, password, profilePicture });
    await newUser.save();

    const user = {
      name: newUser.name,
      email: newUser.email,
      picture: newUser.profilePicture,
    };

    return response(res, 201, null, user);
  } catch (error) {
    return response(res, 500, error.message, null);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const isMatch = await user.comparePassword(password);

    if (!user) return response(res, 404, "Foydalanuvchi topilmadi!");
    if (!isMatch) return response(res, 400, "Parol noto'gri!");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return response(res, 200, null, { token, user });
  } catch (error) {
    return response(res, 500, error.message, null);
  }
};

const getProfile = async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user.id).select("-password");

    return response(res, 200, null, user);
  } catch (error) {
    return response(res, 500, error.message, null);
  }
};

module.exports = { register, login, getProfile };
