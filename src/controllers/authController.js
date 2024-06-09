const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const admin = require('firebase-admin');
const crypto = require('crypto');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;
// OTP expiration time (15 minutes)
const OTP_EXPIRATION = 15 * 60 * 1000; 

// Register User
exports.registerUser = async (req, res) => {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, username, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const userRef = admin.firestore().collection('users');
    // Check if email or username already exists
    const userSnapshot = await userRef.where('email', '==', email).get();
    const usernameSnapshot = await admin.firestore().collection('users').where('username', '==', username).get();

    if (!userSnapshot.empty) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    if (!usernameSnapshot.empty) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    await userRef.add({
      email,
      password: hashedPassword,
      username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profileCompleted: false,
      role: 'user', // default role
      job: '',
      bio: '',
      photoUrl: ''
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const userRef = admin.firestore().collection('users');
    const userSnapshot = await userRef.where('username', '==', username).get();

    // Check if user exists
    if (userSnapshot.empty) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: userDoc.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '2d' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const userRef = admin.firestore().collection('users');
    const userSnapshot = await userRef.where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex');
    const otpExpiration = Date.now() + OTP_EXPIRATION;

    const userDoc = userSnapshot.docs[0];
    await userRef.doc(userDoc.id).update({
      otp,
      otpExpiration,
    });

    // Send OTP to user email here (not implemented)

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  // Validate request input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, otp, newPassword, confirmNewPassword } = req.body;

  // Check if new passwords match
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const userRef = admin.firestore().collection('users');
    const userSnapshot = await userRef.where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    // Check if OTP is valid and not expired
    if (user.otp !== otp || user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRef.doc(userDoc.id).update({
      password: hashedPassword,
      otp: admin.firestore.FieldValue.delete(),
      otpExpiration: admin.firestore.FieldValue.delete(),
      updatedAt: new Date().toISOString()
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};
