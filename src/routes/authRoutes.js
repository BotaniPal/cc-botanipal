const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register-user", authController.registerUser);
router.post("/register-expert", authController.registerExpert);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
