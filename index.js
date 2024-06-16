const express = require("express");
const dotenv = require("dotenv");
const rateLimiter = require("./src/middlewares/rateLimiter");
const admin = require("firebase-admin");
const cron = require('node-cron');

dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID.replace(/\\n/g, '\n'),
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const app = express();
app.use(express.json());

const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const bookmarkRoutes = require("./src/routes/bookmarkRoutes");
const predictRoutes = require("./src/routes/predictRoutes");
const predictService = require('./src/services/predictService');
const forecastRoutes = require('./src/routes/forecastRoutes');
cron.schedule('0 * * * *', () => {
  predictService.deleteExpiredPredictions();
});


app.use("/auth", rateLimiter, authRoutes);
app.use("/profile", profileRoutes);
app.use("/transactions", transactionRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/predict", predictRoutes);
app.use('/forecast', forecastRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
