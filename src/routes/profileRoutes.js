const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const profileController = require("../controllers/profileController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/user", authMiddleware, profileController.getUserProfile);
router.put(
  "/user/update",
  authMiddleware,
  upload.single("profileImage"),
  profileController.updateUserProfile
);

module.exports = router;
