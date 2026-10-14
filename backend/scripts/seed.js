require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const { seedDatabase } = require('./seedService');

const run = async () => {
  try {
    await connectDB();
    const result = await seedDatabase();
    console.log('\n=========================================');
    console.log('🎉 PlacementPro Database Seed Completed!');
    console.log(`- Students: ${result.studentCount}`);
    console.log(`- DSA Questions: ${result.dsaCount}`);
    console.log(`- Companies: ${result.companyCount}`);
    console.log(`- Applications: ${result.applicationCount}`);
    console.log(`- Mock Questions: ${result.mockQuestionCount}`);
    console.log('=========================================\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
};

run();
