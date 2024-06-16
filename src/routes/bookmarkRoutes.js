const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");
const authMiddleware = require("../middlewares/authMiddleware");

router.delete(
  "/:bookmarkId",
  authMiddleware,
  bookmarkController.deleteBookmark
);
router.get("/", authMiddleware, bookmarkController.getUserBookmarks);

module.exports = router;
