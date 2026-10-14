const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const DsaQuestion = require('../models/DsaQuestion');
const Application = require('../models/Application');
const CompanyPreparation = require('../models/CompanyPreparation');
const MockQuestion = require('../models/MockQuestion');
const { seedDatabase, resetDatabase } = require('../scripts/seedService');

// @desc    Get counts of existing records in MongoDB
// @route   GET /api/seed/status
router.get('/status', async (req, res, next) => {
  try {
    const students = await Student.countDocuments();
    const dsa = await DsaQuestion.countDocuments();
    const applications = await Application.countDocuments();
    const companies = await CompanyPreparation.countDocuments();
    const mockQuestions = await MockQuestion.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        hasData: students > 0 || dsa > 0 || applications > 0,
        counts: {
          students,
          dsaQuestions: dsa,
          applications,
          companies,
          mockQuestions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Idempotently populate or update demo data
// @route   POST /api/seed/load
router.post('/load', async (req, res, next) => {
  try {
    const result = await seedDatabase();
    res.status(200).json({
      success: true,
      message: 'Demo dataset successfully loaded into MongoDB!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Reset all collections back to clean demo data
// @route   POST /api/seed/reset
router.post('/reset', async (req, res, next) => {
  try {
    const result = await resetDatabase();
    res.status(200).json({
      success: true,
      message: 'All collections reset and reloaded with clean demo data!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
