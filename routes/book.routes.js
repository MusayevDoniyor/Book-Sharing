const router = require("express").Router();
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", getAllBooks);
router.post("/", authMiddleware, addBook);
router.get("/:id", getBookById);
router.put("/:id", authMiddleware, updateBook);
router.delete("/:id", authMiddleware, deleteBook);

module.exports = router;
