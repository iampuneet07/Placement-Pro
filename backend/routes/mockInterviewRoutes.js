const express = require('express');
const router = express.Router();
const {
  getMockQuestions,
  evaluateAndSaveSession,
  getMockInterviewHistory,
  getMockInterviewById,
} = require('../controllers/mockInterviewController');

router.get('/questions', getMockQuestions);
router.post('/evaluate', evaluateAndSaveSession);
router.route('/').get(getMockInterviewHistory);
router.route('/:id').get(getMockInterviewById);

module.exports = router;
