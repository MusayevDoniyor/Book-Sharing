const router = require("express").Router();
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload");

router.get("/", getAllBooks);
router.post("/", authMiddleware, upload.single("coverImage"), addBook);
router.get("/:id", getBookById);
router.put("/:id", authMiddleware, upload.single("coverImage"), updateBook);
router.delete("/:id", authMiddleware, deleteBook);

module.exports = router;
