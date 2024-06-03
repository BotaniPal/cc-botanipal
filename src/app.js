const express = require('express');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/history', historyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});