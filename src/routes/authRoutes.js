const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Register Route
router.post('/register', [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').notEmpty(),
  check('username', 'Username is required').notEmpty(),
], authController.registerUser);

// Login Route
router.post('/login', [
  check('username', 'Username is required').notEmpty(),
  check('password', 'Password is required').notEmpty(),
], authController.loginUser);

// Forgot Password Route
router.post('/forgot-password', [
  check('email', 'Email is required').isEmail(),
], authController.forgotPassword);

// Reset Password Route
router.post('/reset-password', [
  check('email', 'Email is required').isEmail(),
  check('otp', 'OTP is required').notEmpty(),
  check('newPassword', 'New password is required').notEmpty(),
  check('confirmNewPassword', 'Confirm new password is required').notEmpty(),
], authController.resetPassword);

module.exports = router;
