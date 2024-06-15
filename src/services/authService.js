const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const secret = process.env.JWT_SECRET;

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

const forgotPassword = async ({ email }) => {
  if (!email) {
    throw new Error("Email must be provided");
  }

  const userQuery = await admin
    .firestore()
    .collection("users")
    .where("email", "==", email)
    .get();

  if (userQuery.empty) {
    const expertQuery = await admin
      .firestore()
      .collection("experts")
      .where("email", "==", email)
      .get();

    if (expertQuery.empty) {
      throw new Error("User not found");
    }

    const expertDoc = expertQuery.docs[0];
    const expert = expertDoc.data();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await admin.firestore().collection("passwordResets").doc(expertDoc.id).set({
      otp,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`OTP for expert ${expert.email}: ${otp}`);

    return { message: "OTP sent to email" };
  }

  const userDoc = userQuery.docs[0];
  const user = userDoc.data();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await admin.firestore().collection("passwordResets").doc(userDoc.id).set({
    otp,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`OTP for user ${user.email}: ${otp}`);

  return { message: "OTP sent to email" };
};

const resetPassword = async ({
  username,
  otp,
  newPassword,
  newConfirmPassword,
}) => {
  if (newPassword !== newConfirmPassword) {
    throw new Error("Passwords do not match");
  }

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

    const resetDoc = await admin
      .firestore()
      .collection("passwordResets")
      .doc(expertDoc.id)
      .get();

    if (!resetDoc.exists || resetDoc.data().otp !== otp) {
      throw new Error("Invalid or expired OTP");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await admin.auth().updateUser(expertDoc.id, {
      password: hashedPassword,
    });

    await admin.firestore().collection("experts").doc(expertDoc.id).update({
      password: hashedPassword,
    });

    await admin
      .firestore()
      .collection("passwordResets")
      .doc(expertDoc.id)
      .delete();
    await admin.firestore().collection("sessions").doc(expertDoc.id).delete();

    return { message: "Password reset successfully. Please login again." };
  }

  const userDoc = userQuery.docs[0];
  const user = userDoc.data();

  const resetDoc = await admin
    .firestore()
    .collection("passwordResets")
    .doc(userDoc.id)
    .get();

  if (!resetDoc.exists || resetDoc.data().otp !== otp) {
    throw new Error("Invalid or expired OTP");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await admin.auth().updateUser(userDoc.id, {
    password: hashedPassword,
  });

  await admin.firestore().collection("users").doc(userDoc.id).update({
    password: hashedPassword,
  });

  await admin.firestore().collection("passwordResets").doc(userDoc.id).delete();
  await admin.firestore().collection("sessions").doc(userDoc.id).delete();

  return { message: "Password reset successfully. Please login again." };
};

module.exports = {
  registerUser,
  registerExpert,
  login,
  forgotPassword,
  resetPassword,
};
