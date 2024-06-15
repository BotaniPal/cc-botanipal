const admin = require('firebase-admin');

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function createBookmark(userId, prediction, imageUrl, predictionType) {
  try {
    const bookmarkData = {
      userId: userId,
      imageUrl: imageUrl,
      predictionResult: prediction,
      predictionType,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    const bookmarkRef = await db.collection("bookmarks").add(bookmarkData);

    const predictionId = await db.collection('predictions').where('imageUrl', '==', imageUrl).get(); // Cari berdasarkan imageUrl
    if (!predictionId.empty) {
      await db.collection('predictions').doc(predictionId.docs[0].id).delete();
    } else {
      console.warn('Prediction not found for image:', imageUrl);
    }

    const fileName = imageUrl.split('/').pop();
    const oldImageRef = bucket.file(`predictions/${fileName}`);
    const newImageRef = bucket.file(`bookmarks/${predictionType}/${fileName}`);
    await oldImageRef.move(newImageRef);

    bookmarkData.imageUrl = `https://storage.googleapis.com/${bucket.name}/bookmarks/${predictionType}/${fileName}`;
    await newImageRef.makePrivate();

    return {
      message: "Bookmark created successfully",
      bookmarkId: bookmarkRef.id,
    };
  } catch (error) {
    console.error("Error creating bookmark:", error);
    throw new Error("Failed to create bookmark");
  }
}

async function deleteBookmark(bookmarkId, userId) {
  try {
    const bookmarkRef = db.collection('bookmarks').doc(bookmarkId);
    const bookmarkSnapshot = await bookmarkRef.get();

    if (!bookmarkSnapshot.exists) {
      throw new Error('Bookmark not found');
    }

    const bookmarkData = bookmarkSnapshot.data();

    if (bookmarkData.userId !== userId) {
      throw new Error('Unauthorized to delete bookmark');
    }

    const imageUrl = bookmarkData.imageUrl;
    console.log("Deleting image:", imageUrl);
    if (imageUrl && imageUrl.startsWith('https://storage.googleapis.com/')) {
      const pathParts = imageUrl.split('/');
      const predictionType = pathParts[pathParts.length - 2];
      const fileName = pathParts[pathParts.length - 1];
      const imageRef = bucket.file(`bookmarks/${predictionType}/${fileName}`);
      try {
        await imageRef.delete();
        console.log('Image deleted successfully from Firebase Storage');
      } catch (storageError) {
        console.error('Error deleting image from Firebase Storage:', storageError);
      }
    } else {
      console.warn('Invalid image URL:', imageUrl);
    }

    await bookmarkRef.delete();
    console.log('Bookmark deleted successfully from Firestore');

    return { message: 'Bookmark deleted successfully' };
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    throw error; 
  }
}

async function getUserBookmarks(userId) {
  try {
    const bookmarksSnapshot = await db.collection('bookmarks')
      .where('userId', '==', userId)
      .get();
    const bookmarks = bookmarksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return bookmarks;
  } catch (error) {
    console.error("Error getting user bookmarks:", error);
    throw new Error("Failed to get user bookmarks");
  }
}

module.exports = {
  createBookmark,
  deleteBookmark,
  getUserBookmarks,
};
