const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const secret = process.env.JWT_SECRET;
const db = admin.firestore();

const validateUsernameAndEmail = async (username, email) => {
  if (!username || !email) {
    throw new Error("Username and email must be provided");
  }

  const usersQuery = await admin
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  if (!usersQuery.empty) {
    throw new Error("Username already exists");
  }

  const emailQuery = await admin
    .firestore()
    .collection("users")
    .where("email", "==", email)
    .get();

  if (!emailQuery.empty) {
    throw new Error("Email already exists");
  }

  const expertsQuery = await admin
    .firestore()
    .collection("experts")
    .where("username", "==", username)
    .get();

  if (!expertsQuery.empty) {
    throw new Error("Username already exists");
  }

  const expertEmailQuery = await admin
    .firestore()
    .collection("experts")
    .where("email", "==", email)
    .get();

  if (!expertEmailQuery.empty) {
    throw new Error("Email already exists");
  }
};

const validatePasswordLength = (password) => {
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
};

const validateUsernameLength = (username) => {
  if (!username || username.length < 4) {
    throw new Error("Username must be at least 4 characters long");
  }
};

const registerUser = async ({ username, email, password, confirmPassword }) => {
  validateUsernameLength(username);
  validatePasswordLength(password);

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  await validateUsernameAndEmail(username, email);

  const hashedPassword = await bcrypt.hash(password, 10);

  const userRecord = await admin.auth().createUser({
    email,
    password: hashedPassword,
    displayName: username,
  });

  await admin.firestore().collection("users").doc(userRecord.uid).set({
    username,
    email,
    password: hashedPassword,
    role: "user",
  });

  return { message: "User registered successfully", uid: userRecord.uid };
};

const registerExpert = async ({
  username,
  email,
  job,
  password,
  confirmPassword,
}) => {
  validateUsernameLength(username);
  validatePasswordLength(password);

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  await validateUsernameAndEmail(username, email);

  const hashedPassword = await bcrypt.hash(password, 10);

  const userRecord = await admin.auth().createUser({
    email,
    password: hashedPassword,
    displayName: username,
  });

  await admin.firestore().collection("experts").doc(userRecord.uid).set({
    username,
    email,
    job,
    password: hashedPassword,
    role: "expert",
  });

  return { message: "Expert registered successfully", uid: userRecord.uid };
};

const login = async ({ username, password }) => {
  validateUsernameLength(username);
  validatePasswordLength(password);

  const userQuery = await admin
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  if (userQuery.empty) {
    const expertQuery = await admin
      .firestore()
      .collection("experts")
      .where("username", "==", username)
      .get();

    if (expertQuery.empty) {
      throw new Error("User not found");
    }

    const expertDoc = expertQuery.docs[0];
    const expert = expertDoc.data();

    const passwordMatch = await bcrypt.compare(password, expert.password);

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: expertDoc.id, username: expert.username, role: expert.role },
      secret,
      { expiresIn: "2d" }
    );

    await admin
      .firestore()
      .collection("sessions")
      .doc(expertDoc.id)
      .set({ token });

    return { token, user: expert };
  }

  const userDoc = userQuery.docs[0];
  const user = userDoc.data();

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: userDoc.id, username: user.username, role: user.role },
    secret,
    { expiresIn: "2d" }
  );

  await admin.firestore().collection("sessions").doc(userDoc.id).set({ token });

  return { token, user };
};

async function forgotPassword({ email }) {
  if (!email) {
    throw new Error("Email must be provided");
  }

  const usersRef = db.collection("users");
  const expertsRef = db.collection("experts");
  const passwordResetsRef = db.collection("passwordResets");

  let userDoc = null;
  try {
    const userSnapshot = await usersRef.where("email", "==", email).get();
    const expertSnapshot = await expertsRef.where("email", "==", email).get();

    let userDoc;
    if (!userSnapshot.empty) {
      userDoc = userSnapshot.docs[0];
    } else if (!expertSnapshot.empty) {
      userDoc = expertSnapshot.docs[0];
    } else {
      throw new Error("User not found");
    }

    const user = userDoc.data();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await passwordResetsRef.doc(userDoc.id).set({
      otp,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "Botanipal Service",
      to: email,
      subject: "Reset Password OTP",
      text: `Kode OTP Anda untuk reset password adalah: ${otp}. Kode ini akan kadaluarsa dalam 5 menit.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);

    return { message: "OTP sent to email", otp };
  } catch (error) {
    console.error("Error in forgotPassword:", error);

    if (userDoc) {
      await passwordResetsRef.doc(userDoc.id).delete();
    }

    throw new Error("Failed to send OTP. Please try again later.");
  }
}

async function deleteExpiredOTPs() {
  const now = admin.firestore.Timestamp.now();
  const expiredOTPs = await admin
    .firestore()
    .collection("passwordResets")
    .where("expiresAt", "<", now)
    .get();

  const batch = db.batch();
  expiredOTPs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  console.log(`Deleted ${expiredOTPs.size} expired OTPs.`);
}
setInterval(deleteExpiredOTPs, 5 * 60 * 1000);

async function resetPassword({ username, otp, newPassword, newConfirmPassword }) {
  if (!username || !otp || !newPassword || !newConfirmPassword) {
    throw new Error("Username, OTP, and new password must be provided");
  }

  if (newPassword !== newConfirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long");
  }

  const passwordResetsRef = db.collection('passwordResets');
  const usersRef = db.collection('users');
  const expertsRef = db.collection('experts');
  const sessionsRef = db.collection('sessions');

  try {
    const userSnapshot = await usersRef.where("username", "==", username).get();
    const expertSnapshot = await expertsRef.where("username", "==", username).get();

    let userDoc = null;
    if (!userSnapshot.empty) {
      userDoc = userSnapshot.docs[0];
    } else if (!expertSnapshot.empty) {
      userDoc = expertSnapshot.docs[0];
    } else {
      throw new Error("User not found");
    }

    const passwordResetRef = passwordResetsRef.doc(userDoc.id);
    const passwordResetDoc = await passwordResetRef.get();

    if (!passwordResetDoc.exists) {
      throw new Error("Invalid or expired OTP");
    }

    const resetData = passwordResetDoc.data();
    if (resetData.otp !== otp) {
      throw new Error("Invalid or expired OTP");
    }
    
    const now = admin.firestore.Timestamp.now();
    if (resetData.expiresAt < now) {
      await passwordResetRef.delete(); 
      throw new Error("Invalid or expired OTP");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await admin.auth().updateUser(userDoc.id, { password: hashedPassword });

    const collectionName = userDoc.data().role === 'user' ? 'users' : 'experts';
    await admin.firestore().collection(collectionName).doc(userDoc.id).update({ password: hashedPassword });

    await passwordResetRef.delete();
    await sessionsRef.doc(userDoc.id).delete();

    return { message: "Password reset successfully. Please login again." };
  } catch (error) {
    console.error("Error in resetPassword:", error);
    if (error.message === 'Invalid or expired OTP' || error.message === 'User not found') {
      throw new Error(error.message, 400);
    } else {
      throw new Error('Failed to reset password', 500);
    }
  }
}

module.exports = {
  registerUser,
  registerExpert,
  login,
  forgotPassword,
  resetPassword,
};
