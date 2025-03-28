const router = require("express").Router();
const {
  requestBorrow,
  respondToRequest,
  returnBook,
  getMyBorrows,
} = require("../controllers/borrow.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/:bookId/request", authMiddleware, requestBorrow);
router.put("/:requestId/respond", authMiddleware, respondToRequest);
router.put("/:requestId/return", authMiddleware, returnBook);
router.get("/my-borrows", authMiddleware, getMyBorrows);

module.exports = router;
