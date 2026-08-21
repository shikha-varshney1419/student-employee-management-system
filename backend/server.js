const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const { testConnection } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// ------------------------------------------------------------------
// Core middleware
// ------------------------------------------------------------------
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------------
// Health check
// ------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running.', env: config.nodeEnv });
});

// ------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/employees', employeeRoutes);

// ------------------------------------------------------------------
// 404 + error handling (must be registered last)
// ------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ------------------------------------------------------------------
// Start
// ------------------------------------------------------------------
async function start() {
  await testConnection();
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Student & Employee Management API running on http://localhost:${config.port}`);
    // eslint-disable-next-line no-console
    console.log(`[server] Environment: ${config.nodeEnv}`);
  });
}

start();

module.exports = app;
