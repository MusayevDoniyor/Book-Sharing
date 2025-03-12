const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token yo'q yoki noto'g'ri!" });
    }

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user)
      return res.status(401).json({ message: "Foydalanuvchi topilmadi!" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Token noto'g'ri yoki eskirgan!" });
  }
};

module.exports = authMiddleware;
