const DsaQuestion = require('../models/DsaQuestion');
const StudyActivity = require('../models/StudyActivity');

// @desc    Get all DSA questions with filtering, searching, and sorting
// @route   GET /api/dsa
exports.getDsaQuestions = async (req, res, next) => {
  try {
    const { search, topic, difficulty, status, sort } = req.query;

    const query = {};

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { companyTags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    if (topic && topic !== 'All') {
      query.topic = topic;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'difficulty') sortOption = { difficulty: 1 };
    if (sort === 'title') sortOption = { title: 1 };

    const questions = await DsaQuestion.find(query).sort(sortOption);

    // Compute summary numbers on the fly
    const totalCount = await DsaQuestion.countDocuments();
    const solvedCount = await DsaQuestion.countDocuments({ status: 'Solved' });
    const inProgressCount = await DsaQuestion.countDocuments({ status: 'In Progress' });
    const notStartedCount = await DsaQuestion.countDocuments({ status: 'Not Started' });

    res.status(200).json({
      success: true,
      count: questions.length,
      stats: {
        total: totalCount,
        solved: solvedCount,
        inProgress: inProgressCount,
        notStarted: notStartedCount,
        solvePercentage: totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0,
      },
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single DSA question by ID
// @route   GET /api/dsa/:id
exports.getDsaQuestionById = async (req, res, next) => {
  try {
    const question = await DsaQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new DSA question
// @route   POST /api/dsa
exports.createDsaQuestion = async (req, res, next) => {
  try {
    const { title, topic, difficulty, description, companyTags, practiceUrl, status, notes } = req.body;

    const newQuestion = await DsaQuestion.create({
      title,
      topic,
      difficulty: difficulty || 'Easy',
      description: description || '',
      companyTags: Array.isArray(companyTags) ? companyTags : (companyTags ? companyTags.split(',').map((t) => t.trim()) : []),
      practiceUrl: practiceUrl || '',
      status: status || 'Not Started',
      notes: notes || '',
      solvedAt: status === 'Solved' ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: 'DSA question added successfully to MongoDB',
      data: newQuestion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update DSA question
// @route   PUT /api/dsa/:id
exports.updateDsaQuestion = async (req, res, next) => {
  try {
    const prevQuestion = await DsaQuestion.findById(req.params.id);
    if (!prevQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const updates = { ...req.body };
    if (typeof updates.companyTags === 'string') {
      updates.companyTags = updates.companyTags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    if (updates.status === 'Solved' && prevQuestion.status !== 'Solved') {
      updates.solvedAt = new Date();
      // Log a study activity record
      await StudyActivity.create({
        activityType: 'DSA Practice',
        title: `Solved DSA Problem: ${prevQuestion.title}`,
        details: `Topic: ${prevQuestion.topic} (${prevQuestion.difficulty})`,
        minutesSpent: 45,
      }).catch((err) => console.log('Activity log notice:', err.message));
    } else if (updates.status && updates.status !== 'Solved') {
      updates.solvedAt = null;
    }

    const updatedQuestion = await DsaQuestion.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'DSA question updated successfully in MongoDB',
      data: updatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete DSA question
// @route   DELETE /api/dsa/:id
exports.deleteDsaQuestion = async (req, res, next) => {
  try {
    const question = await DsaQuestion.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully from MongoDB',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get topic-wise DSA progress summary using MongoDB aggregation
// @route   GET /api/dsa/stats/topics
exports.getTopicStats = async (req, res, next) => {
  try {
    const topics = [
      'Arrays',
      'Strings',
      'Linked Lists',
      'Stacks and Queues',
      'Searching and Sorting',
      'Binary Trees',
      'Graphs',
      'Dynamic Programming',
    ];

    const stats = await DsaQuestion.aggregate([
      {
        $group: {
          _id: '$topic',
          total: { $sum: 1 },
          solved: {
            $sum: { $cond: [{ $eq: ['$status', 'Solved'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] },
          },
          easySolved: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$status', 'Solved'] }, { $eq: ['$difficulty', 'Easy'] }] }, 1, 0],
            },
          },
          mediumSolved: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$status', 'Solved'] }, { $eq: ['$difficulty', 'Medium'] }] }, 1, 0],
            },
          },
          hardSolved: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$status', 'Solved'] }, { $eq: ['$difficulty', 'Hard'] }] }, 1, 0],
            },
          },
        },
      },
    ]);

    const statMap = {};
    stats.forEach((s) => {
      statMap[s._id] = s;
    });

    const result = topics.map((t) => {
      const item = statMap[t] || { total: 0, solved: 0, inProgress: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0 };
      return {
        topic: t,
        total: item.total,
        solved: item.solved,
        inProgress: item.inProgress,
        percentage: item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0,
        easySolved: item.easySolved,
        mediumSolved: item.mediumSolved,
        hardSolved: item.hardSolved,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
