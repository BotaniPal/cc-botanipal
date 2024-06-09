const admin = require('firebase-admin');
const { validationResult } = require('express-validator');

// Update Profile
exports.updateProfile = async (req, res) => {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const { job, bio, photoUrl } = req.body;

  try {
    const userRef = admin.firestore().collection('users').doc(userId);
    await userRef.update({
      job,
      bio,
      photoUrl,
      updatedAt: new Date().toISOString()
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};
