const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  toggleChecklistItem,
} = require('../controllers/companyController');

router.route('/').get(getCompanies).post(createCompany);
router.patch('/:id/toggle-item', toggleChecklistItem);
router.route('/:id').get(getCompanyById).put(updateCompany);

module.exports = router;
