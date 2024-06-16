const profileService = require("../services/profileService");
const { successResponse, errorResponse } = require("../utils/responseUtils");

exports.getUserProfile = async (req, res) => {
  try {
    const profile = await profileService.getUserProfile(req.user.id);
    successResponse(res, 200, "User profile retrieved successfully", profile);
  } catch (error) {
    if (error.message === "User not found") {
      errorResponse(res, 404, error.message);
    } else if (error.message === "Permission denied to access user data") {
      errorResponse(res, 403, error.message);
    } else {
      errorResponse(res, 500, "Failed to get user profile");
    }
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    const profileImage = req.file;

    const profile = await profileService.updateUserProfile(
      userId,
      profileData,
      profileImage
    );
    successResponse(res, 200, "User profile updated successfully", profile);
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    if (error.message === "User not found") {
      errorResponse(res, 404, error.message);
    } else if (error.message.startsWith("Invalid fields for")) {
      errorResponse(res, 400, error.message);
    } else if (error.message === "Username is already taken") {
      errorResponse(res, 409, error.message);
    } else if (error.message === "Failed to upload image to storage") {
      errorResponse(res, 500, error.message); // Tangani error unggah gambar
    } else {
      errorResponse(res, 500, "Failed to update profile");
    }
  }
};
