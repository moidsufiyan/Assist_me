const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security: restrict CORS to known frontend origin in dev
const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200
}));

// Request body limit to prevent large payload attacks
app.use(express.json({ limit: '10kb' }));

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-starter')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/profile', require('./routes/profile'));
app.use('/api/chat', require('./routes/chat'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// 404 for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global error handler — never leak internal errors
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
