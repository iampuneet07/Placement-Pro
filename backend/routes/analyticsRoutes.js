const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getPreparationAnalytics,
} = require('../controllers/analyticsController');

router.get('/dashboard', getDashboardAnalytics);
router.get('/preparation', getPreparationAnalytics);

module.exports = router;
