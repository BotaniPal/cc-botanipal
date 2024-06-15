const profileService = require("../services/profileService");

exports.getUserProfile = async (req, res) => {
  try {
    const profile = await profileService.getUserProfile(req.user.id);
    res.status(200).json(profile);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    } else if (error.message === "Permission denied to access user data") {
      return res.status(403).json({ error: error.message });
    } else {
      console.error("Error in getUserProfile:", error);
      return res.status(500).json({ error: "Failed to get user profile" });
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
    res.status(200).json(profile);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ error: error.message });
    } else if (
      error.message === "Invalid fields for user role" ||
      error.message === "Invalid fields for expert role"
    ) {
      return res.status(400).json({ error: error.message });
    } else if (error.message === "Username is already taken") {
      return res.status(409).json({ error: error.message });
    } else {
      console.error("Error updating profile:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};
