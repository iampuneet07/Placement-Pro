const Application = require('../models/Application');
const StudyActivity = require('../models/StudyActivity');

// @desc    Get all applications with filters and search
// @route   GET /api/applications
exports.getApplications = async (req, res, next) => {
  try {
    const { search, status, type, sort } = req.query;

    const query = {};

    if (search && search.trim()) {
      query.$or = [
        { company: { $regex: search.trim(), $options: 'i' } },
        { role: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    let sortOption = { applicationDate: -1 };
    if (sort === 'oldest') sortOption = { applicationDate: 1 };
    if (sort === 'company') sortOption = { company: 1 };
    if (sort === 'deadline') sortOption = { deadline: 1 };

    const applications = await Application.find(query).sort(sortOption);

    // Calculate status breakdown
    const allStatuses = ['Wishlist', 'Applied', 'Online Assessment', 'Interview', 'Offer', 'Rejected'];
    const counts = {};
    for (const s of allStatuses) {
      counts[s] = await Application.countDocuments({ status: s });
    }
    const total = await Application.countDocuments();

    // Upcoming interviews
    const upcomingInterviews = await Application.find({
      $or: [
        { status: 'Interview' },
        { interviewDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      ],
    })
      .sort({ interviewDate: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: applications.length,
      stats: {
        total,
        statusCounts: counts,
        interviewCount: counts['Interview'] || 0,
        offerCount: counts['Offer'] || 0,
        appliedCount: counts['Applied'] || 0,
      },
      upcomingInterviews,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }
    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new application
// @route   POST /api/applications
exports.createApplication = async (req, res, next) => {
  try {
    const application = await Application.create(req.body);

    // Log study activity
    await StudyActivity.create({
      activityType: 'Application Submitted',
      title: `Applied to ${application.company}`,
      details: `Role: ${application.role} (${application.status})`,
      minutesSpent: 20,
    }).catch((err) => console.log('Activity log notice:', err.message));

    res.status(201).json({
      success: true,
      message: 'Application added successfully to MongoDB',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
exports.updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application updated successfully in MongoDB',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully from MongoDB',
    });
  } catch (error) {
    next(error);
  }
};
