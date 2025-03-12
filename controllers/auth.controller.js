const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "Email allaqachon mavjud!" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "Ro'yxatdan o'tish muvaffaqiyatli!" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email yoki parol noto'g'ri!" });

    if (user.password !== password)
      return res.status(400).json({ message: "Email yoki parol noto'g'ri!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

module.exports = { register, login, getProfile };
