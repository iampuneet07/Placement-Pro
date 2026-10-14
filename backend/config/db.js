const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placementpro';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`=========================================`);
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📁 Host: ${conn.connection.host}`);
    console.log(`🗄️ Database Name: ${conn.connection.name}`);
    console.log(`🔌 Compass URL: ${uri}`);
    console.log(`=========================================`);
  } catch (error) {
    isConnected = false;
    console.error(`=========================================`);
    console.error(`❌ MongoDB Connection Failed!`);
    console.error(`Error details: ${error.message}`);
    console.error(`Troubleshooting tips:`);
    console.error(`1. Check if MongoDB Service is running: in PowerShell run 'Get-Service MongoDB' or 'net start MongoDB'`);
    console.error(`2. If using MongoDB Compass, ensure it can connect to: ${uri}`);
    console.error(`3. Verify your MONGODB_URI in backend/.env`);
    console.error(`=========================================`);
  }
};

const getDbStatus = () => {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    stateCode,
    stateName: states[stateCode] || 'Unknown',
    isConnected: stateCode === 1,
    databaseName: mongoose.connection.name || 'placementpro',
    host: mongoose.connection.host || '127.0.0.1',
    port: mongoose.connection.port || 27017,
  };
};

module.exports = { connectDB, getDbStatus };
