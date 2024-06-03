const express = require('express');
const { getHistory } = require('../controllers/historyController');
const jwt = require('jsonwebtoken');

const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized' });
  }
};

router.get('/', authenticate, getHistory);

module.exports = router;
