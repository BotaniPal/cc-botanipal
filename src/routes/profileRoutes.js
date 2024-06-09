const express = require('express');
const { check } = require('express-validator');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Get Profile Route
router.get('/', authMiddleware.verifyToken, profileController.getProfile);

// Update Profile Route
router.put('/', [
  check('job', 'Job is required').notEmpty(),
  check('bio', 'Bio is required').notEmpty(),
  check('photoUrl', 'Photo URL is required').notEmpty(),
], authMiddleware.verifyToken, profileController.updateProfile);

module.exports = router;
