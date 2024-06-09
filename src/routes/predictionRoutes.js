const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const predictionController = require('../controllers/predictionController');

const router = express.Router();

// Prediction route
router.post('/predict', authMiddleware, upload.single('image'), predictionController.predictPlantDisease);

module.exports = router;
