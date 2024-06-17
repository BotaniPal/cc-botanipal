const admin = require("firebase-admin");

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function getUserProfile(userId) {
  try {
    const userDocRef = db.collection("users").doc(userId);
    const expertDocRef = db.collection("experts").doc(userId);

    const [userDocSnapshot, expertDocSnapshot] = await Promise.all([
      userDocRef.get(),
      expertDocRef.get(),
    ]);

    if (userDocSnapshot.exists) {
      return userDocSnapshot.data();
    } else if (expertDocSnapshot.exists) {
      return expertDocSnapshot.data();
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    if (error.code === 5) {
      throw new Error("User not found.");
    } else if (error.code === 13) {
      throw new Error("Permission denied to access user data.");
    } else {
      console.error("Error getting user profile:", error);
      throw new Error("Failed to get user profile. Please try again later.");
    }
  }
}

async function uploadProfileImage(file, userId) {
  const fileName = `${userId}_profile_image_${Date.now()}.${file.originalname
    .split(".")
    .pop()}`;
  const fileUpload = bucket.file(`profileImage/${fileName}`);

  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  blobStream.on("error", (error) => {
    console.error("Error uploading image to Firebase Storage:", error);
    throw error;
  });

  blobStream.on("finish", () => {
    console.log("Image uploaded successfully to Firebase Storage");
  });

  blobStream.end(file.buffer);

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
  return publicUrl;
}

async function updateUserProfile(userId, profileData, profileImage) {
  try {
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get();
    const expertDoc = await admin
      .firestore()
      .collection("experts")
      .doc(userId)
      .get();

    if (!userDoc.exists && !expertDoc.exists) {
      throw new Error("User not found");
    }

    const existingUserData = userDoc.exists ? userDoc.data() : expertDoc.data();
    const userRole = existingUserData.role;

    const allowedFields = {
      user: ["username", "name", "bio", "profileImage"],
      expert: ["username", "name", "bio", "job", "experience", "profileImage"],
    };

    const invalidFields = Object.keys(profileData).filter(
      (field) => !allowedFields[userRole].includes(field)
    );
    if (invalidFields.length > 0) {
      throw new Error(
        `Invalid fields for ${userRole} role: ${invalidFields.join(", ")}`
      );
    }

    if (
      profileData.username &&
      profileData.username !== existingUserData.username
    ) {
      const usersSnapshot = await db
        .collection("users")
        .where("username", "==", profileData.username)
        .get();
      const expertsSnapshot = await db
        .collection("experts")
        .where("username", "==", profileData.username)
        .get();

      const isUsernameTaken =
        usersSnapshot.docs.some((doc) => doc.id !== userId) ||
        expertsSnapshot.docs.some((doc) => doc.id !== userId);

      if (isUsernameTaken) {
        throw new Error("Username is already taken");
      }
    }

    if (profileImage) {
      const imageUrl = await uploadProfileImage(profileImage, userId);
      profileData.profileImage = imageUrl;

      const userDoc = await db.collection("users").doc(userId).get();
      const expertDoc = await db.collection("experts").doc(userId).get();

      const existingUser = userDoc.exists ? userDoc.data() : null;
      const existingExpert = expertDoc.exists ? expertDoc.data() : null;

      const existingProfileImage =
        existingUser?.profileImage || existingExpert?.profileImage;

      if (existingProfileImage && existingProfileImage !== imageUrl) {
        const oldImagePath = existingProfileImage.replace(
          `https://storage.googleapis.com/${bucket.name}/`,
          ""
        );
        const oldImagePathWithFolder = `profileImage/${oldImagePath
          .split("/")
          .pop()}`;

        const [exists] = await bucket.file(oldImagePathWithFolder).exists();

        if (exists) {
          await bucket.file(oldImagePathWithFolder).delete();
        }
      }
    }

    console.log(`Updating profile for user ${userId} with data:`, profileData);
    await admin
      .firestore()
      .collection(userRole + "s")
      .doc(userId)
      .update(profileData);
    console.log(`Profile update successful for user ${userId}`);

    const updatedUserDoc = await admin
      .firestore()
      .collection(userRole + "s")
      .doc(userId)
      .get();
    return updatedUserDoc.data();
  } catch (error) {
    console.error(`Error updating profile for user ${userId}:`, error);
    throw error;
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
};
