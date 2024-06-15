const express = require('express');
const router = express.Router();
const predictController = require('../controllers/predictController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/plant', authMiddleware, upload.single('image'), predictController.predictPlant);
router.post('/disease', authMiddleware, upload.single('image'), predictController.predictDisease);
router.post('/bookmark', authMiddleware, predictController.createBookmarkFromPrediction);

module.exports = router;