require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, connectDB } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/operations', require('./routes/operationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Serve Static Frontend (Production)
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await sequelize.sync();
    // Only listen if not on Vercel
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server started on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error('Error starting server:', err);
  }
}

startServer();

module.exports = app;
