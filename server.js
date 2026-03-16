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
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Catch-all for SPA routing
app.get('*', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
});

// For Vercel, we need to export the app but also init the DB
let dbInitialised = false;
const initDBCon = async () => {
      if (dbInitialised) return;
      try {
              await connectDB();
              await sequelize.sync();
              dbInitialised = true;
              console.log('Database initialised successfully');
      } catch (err) {
              console.error('Database initialisation failed:', err);
      }
};

// Start DB init but don't block the export
initDBCon();

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, '0.0.0.0', () => {
              console.log(`Server started on port ${PORT}`);
      });
}

module.exports = app;
