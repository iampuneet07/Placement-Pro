require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB, getDbStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const studentRoutes = require('./routes/studentRoutes');
const dsaRoutes = require('./routes/dsaRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const companyRoutes = require('./routes/companyRoutes');
const mockInterviewRoutes = require('./routes/mockInterviewRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const seedRoutes = require('./routes/seedRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for academic presentation
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root informative endpoint
app.get('/', (req, res) => {
  const dbStatus = getDbStatus();
  res.status(200).json({
    project: 'PlacementPro - Student Placement Preparation & Tracking Portal',
    version: '1.0.0',
    type: 'Final Year B.Tech CSE Project API',
    status: 'Running',
    database: dbStatus,
    endpoints: {
      health: '/api/health',
      students: '/api/students',
      dsa: '/api/dsa',
      applications: '/api/applications',
      companies: '/api/companies',
      mockInterviews: '/api/mock-interviews',
      analytics: '/api/analytics/dashboard',
      seed: '/api/seed/status',
    },
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/mock-interviews', mockInterviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/seed', seedRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on PlacementPro server.`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 PlacementPro API Server running on http://localhost:${PORT}`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = { app, server };
