const predictService = require('../services/predictService');
const bookmarkService = require('../services/bookmarkService');
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.predictPlant = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageFile = req.file;

    if (!imageFile) {
      return errorResponse(res, 400, 'No image file provided');
    }

    const predictionResult = await predictService.predictPlant(imageFile, userId);
    successResponse(res, 200, 'Prediction successful', predictionResult);
  } catch (error) {
    console.error('Error in predictPlant:', error);
    if (error.message === 'Invalid prediction response from model') {
      errorResponse(res, 400, 'Invalid image or model error');
    } else if (error.message.includes('Failed to upload image')){
      errorResponse(res, 500, error.message);
    } else {
      errorResponse(res, 500, 'Failed to predict plant');
    } 
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
    successResponse(res, 200, 'Prediction successful', predictionResult);
  } catch (error) {
    console.error('Error in predictDisease:', error);
    if (error.message === 'Invalid prediction response from model') {
      errorResponse(res, 400, 'Invalid image or model error'); 
    } else if (error.message.includes('Failed to upload image')){
      errorResponse(res, 500, error.message);
    } else {
      errorResponse(res, 500, 'Failed to predict disease'); 
    }
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
