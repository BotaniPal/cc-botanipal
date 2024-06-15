const predictService = require('../services/predictService');
const bookmarkService = require('../services/bookmarkService');

exports.predictPlant = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const predictionResult = await predictService.predictPlant(imageFile, userId);
    res.status(200).json(predictionResult);
  } catch (error) {
    console.error('Error in predictPlant:', error);
    res.status(500).json({ error: error.message || 'Failed to predict plant' });
  }
};

exports.predictDisease = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const predictionResult = await predictService.predictDisease(imageFile, userId);
    res.status(200).json(predictionResult);
  } catch (error) {
    console.error('Error in predictDisease:', error);
    res.status(500).json({ error: error.message || 'Failed to predict disease' });
  }
};

exports.createBookmarkFromPrediction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { prediction, imageUrl, predictionType } = req.body;

    const bookmark = await bookmarkService.createBookmark(userId, prediction, imageUrl, predictionType); 
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
