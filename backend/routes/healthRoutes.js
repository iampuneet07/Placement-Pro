const express = require('express');
const router = express.Router();
const { getDbStatus } = require('../config/db');

router.get('/', (req, res) => {
  const dbStatus = getDbStatus();

  res.status(200).json({
    success: true,
    message: 'PlacementPro Backend API is online and operational',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus.stateName,
      connected: dbStatus.isConnected,
      name: dbStatus.databaseName,
      host: dbStatus.host,
      port: dbStatus.port,
      compassUrl: `mongodb://${dbStatus.host}:${dbStatus.port}/${dbStatus.databaseName}`,
    },
  });
});

module.exports = router;
