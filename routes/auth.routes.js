const router = require("express").Router();
const {
  register,
  login,
  getProfile,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");

router.post("/register", upload.single("profilePicture"), register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
