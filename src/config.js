const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS)),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };