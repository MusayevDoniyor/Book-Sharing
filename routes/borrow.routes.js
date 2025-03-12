const router = require("express").Router();
const {
  requestBorrow,
  respondToRequest,
} = require("../controllers/borrow.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/:bookId/request", authMiddleware, requestBorrow);
router.put("/:requestId/respond", authMiddleware, respondToRequest);

module.exports = router;
