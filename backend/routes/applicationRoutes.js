const express = require('express');
const router = express.Router();
const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');

router.route('/').get(getApplications).post(createApplication);
router.route('/:id').get(getApplicationById).put(updateApplication).delete(deleteApplication);

module.exports = router;
