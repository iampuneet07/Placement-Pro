const CompanyPreparation = require('../models/CompanyPreparation');
const StudyActivity = require('../models/StudyActivity');

// @desc    Get all company preparation profiles
// @route   GET /api/companies
exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyPreparation.find().sort({ companyName: 1 });
    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company preparation profile by ID or slug
// @route   GET /api/companies/:id
exports.getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let company;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      company = await CompanyPreparation.findById(id);
    } else {
      company = await CompanyPreparation.findOne({ slug: id.toLowerCase() });
    }

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company preparation guide not found',
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new company prep guide
// @route   POST /api/companies
exports.createCompany = async (req, res, next) => {
  try {
    const company = await CompanyPreparation.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Company preparation guide created in MongoDB',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company preparation profile
// @route   PUT /api/companies/:id
exports.updateCompany = async (req, res, next) => {
  try {
    const company = await CompanyPreparation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company preparation updated in MongoDB',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle checklist item completion (aptitude, coding, technical, hr)
// @route   PATCH /api/companies/:id/toggle-item
exports.toggleChecklistItem = async (req, res, next) => {
  try {
    const { section, itemId, completed } = req.body;
    // section: 'aptitudeTopics' | 'codingTopics' | 'technicalTopics' | 'hrQuestions'

    const company = await CompanyPreparation.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    if (!company[section]) {
      return res.status(400).json({
        success: false,
        message: `Invalid section: ${section}`,
      });
    }

    const item = company[section].find((it) => (it.id === itemId || it._id.toString() === itemId));
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Checklist item not found',
      });
    }

    item.completed = typeof completed === 'boolean' ? completed : !item.completed;
    await company.save();

    // Log study activity if marked as completed
    if (item.completed) {
      await StudyActivity.create({
        activityType: 'Company Prep',
        title: `Prepared for ${company.companyName}`,
        details: `Completed topic: ${item.topic || item.question}`,
        minutesSpent: 25,
      }).catch((err) => console.log('Activity log notice:', err.message));
    }

    res.status(200).json({
      success: true,
      message: `Topic status updated to ${item.completed ? 'Completed' : 'Pending'} in MongoDB`,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};
