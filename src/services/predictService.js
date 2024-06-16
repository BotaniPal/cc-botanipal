const admin = require("firebase-admin");
const axios = require("axios");
const FormData = require("form-data");

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function uploadImageToStorage(file, userId, folderName) {
  try {
    const bucket = admin.storage().bucket();
    const fileName = `${userId}_${Date.now()}.${file.originalname
      .split(".")
      .pop()}`;
    const fileUpload = bucket.file(`${folderName}/${fileName}`);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.error("Error uploading image to Firebase Storage:", error);
      throw new Error("Failed to upload image to storage");
    });

    blobStream.on("finish", async () => {
      await fileUpload.makePublic();

      console.log("Image uploaded successfully to Firebase Storage");
    });
    blobStream.end(file.buffer);
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${folderName}/${fileName}`;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return publicUrl;
  } catch (error) {
    console.error("Unexpected error while uploading image:", error);
    throw new Error("Failed to upload image to storage");
  }
}

async function predictPlantOrDisease(
  imageFile,
  userId,
  modelEndpoint,
  predictionType
) {
  let imageUrl;
  try {
    imageUrl = await uploadImageToStorage(imageFile, userId, "predictions");

    const response = await axios.post(
      modelEndpoint,
      { file_url: imageUrl },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response from model:", response.data);

    if (!response.data || typeof response.data.prediction !== "string") {
      throw new Error("Invalid prediction response from model");
    }

    const prediction = response.data.prediction;

    const predictionData = {
      userId,
      imageUrl,
      prediction,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      predictionType,
    };

    const predictionRef = await db
      .collection("predictions")
      .add(predictionData);

    return {
      predictionId: predictionRef.id,
      prediction,
      imageUrl,
    };
  } catch (error) {
    console.error(`Error predicting ${predictionType}:`, error);

    if (imageUrl) {
      try {
        const filePath = imageUrl.replace(
          `https://storage.googleapis.com/${bucket.name}/`,
          ""
        );
        await bucket.file(filePath).delete();
        console.log("Image deleted due to prediction error:", imageUrl);
      } catch (deleteError) {
        console.error("Error deleting image:", deleteError);
      }
    }

    throw new Error(`Failed to predict ${predictionType}`);
  }
}

async function deleteExpiredPredictions() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;

  try {
    const predictionsRef = db.collection('predictions');
    const expiredPredictions = await predictionsRef
      .where('timestamp', '<', admin.firestore.Timestamp.fromMillis(oneHourAgo))
      .get();

    if (expiredPredictions.empty) {
      console.log('No expired predictions found.');
      return;
    }

    console.log(`Found ${expiredPredictions.size} expired predictions.`);

    const promises = expiredPredictions.docs.map(async (doc) => {
      const predictionData = doc.data();
      const imageUrl = predictionData.imageUrl;

      if (imageUrl) {
        try {
          const filePath = imageUrl.replace(`https://storage.googleapis.com/${bucket.name}/`, '');
          await bucket.file(filePath).delete();
          console.log('Deleted expired image:', imageUrl);
        } catch (deleteError) {
          console.error('Error deleting image:', imageUrl, deleteError);
        }
      }
      try {
        await doc.ref.delete();
        console.log('Deleted expired prediction:', doc.id);
      } catch (deleteError) {
        console.error('Error deleting prediction:', doc.id, deleteError);
      }
    });

    await Promise.all(promises);
    console.log('Expired predictions cleanup completed.');

  } catch (error) {
    console.error('Error deleting expired predictions:', error);
  }
}

module.exports = {
  predictPlant: (imageFile, userId) =>
    predictPlantOrDisease(
      imageFile,
      userId,
      process.env.PLANT_MODEL_URL,
      "plant"
    ),
  predictDisease: (imageFile, userId) =>
    predictPlantOrDisease(
      imageFile,
      userId,
      process.env.DISEASE_MODEL_URL,
      "disease"
    ),
  deleteExpiredPredictions,
};
