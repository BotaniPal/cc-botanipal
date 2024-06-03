const { db } = require('../config');

const getHistory = async (req, res) => {
  const userId = req.user.userId;
  const historyQuerySnapshot = await db.collection('history').where('userId', '==', userId).get();
  
  const history = historyQuerySnapshot.docs.map(doc => doc.data());
  
  res.send(history);
};

module.exports = { getHistory };
