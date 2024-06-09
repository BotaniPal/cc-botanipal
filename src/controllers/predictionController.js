const admin = require('firebase-admin');
const model = require('../model/plantDiseaseModel'); // Assuming you have a model for prediction

// Predict plant disease from uploaded image
exports.predictPlantDisease = async (req, res) => {
  try {
    const imagePath = req.file.path;
    
    // Use your model to predict plant disease
    const prediction = await model.predict(imagePath);

    // Save prediction result to Firestore
    const userId = req.user.id;
    const predictionRef = admin.firestore().collection('predictions');
    const predictionDoc = await predictionRef.add({
      userId,
      imagePath,
      prediction,
      createdAt: new Date().toISOString(),
    });

    res.json({ message: 'Prediction successful', predictionId: predictionDoc.id, prediction });
  } catch (error) {
    res.status(500).json({ message: 'Error predicting plant disease', error: error.message });
  }
};
