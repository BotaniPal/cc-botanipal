const { db } = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { email, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.collection('users').add({
    email,
    password: hashedPassword
  });
  
  res.status(201).send({ message: 'User registered successfully' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const userQuerySnapshot = await db.collection('users').where('email', '==', email).get();
  
  if (userQuerySnapshot.empty) {
    return res.status(404).send({ message: 'User not found' });
  }

  const user = userQuerySnapshot.docs[0].data();
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: userQuerySnapshot.docs[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.send({ token });
};

module.exports = { register, login };
