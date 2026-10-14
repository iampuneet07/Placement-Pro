const express = require('express');
const router = express.Router();
const {
  getDsaQuestions,
  getDsaQuestionById,
  createDsaQuestion,
  updateDsaQuestion,
  deleteDsaQuestion,
  getTopicStats,
} = require('../controllers/dsaController');

router.get('/stats/topics', getTopicStats);
router.route('/').get(getDsaQuestions).post(createDsaQuestion);
router.route('/:id').get(getDsaQuestionById).put(updateDsaQuestion).delete(deleteDsaQuestion);

module.exports = router;
