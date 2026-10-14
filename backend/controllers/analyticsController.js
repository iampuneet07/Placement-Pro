const DsaQuestion = require('../models/DsaQuestion');
const Application = require('../models/Application');
const CompanyPreparation = require('../models/CompanyPreparation');
const MockInterview = require('../models/MockInterview');
const StudyActivity = require('../models/StudyActivity');
const Student = require('../models/Student');

// @desc    Get complete real-time dashboard analytics derived from MongoDB
// @route   GET /api/analytics/dashboard
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    // 1. DSA counts
    const totalDsa = await DsaQuestion.countDocuments();
    const solvedDsa = await DsaQuestion.countDocuments({ status: 'Solved' });
    const inProgressDsa = await DsaQuestion.countDocuments({ status: 'In Progress' });

    // 2. Applications counts
    const totalApplications = await Application.countDocuments();
    const interviewCount = await Application.countDocuments({ status: 'Interview' });
    const offerCount = await Application.countDocuments({ status: 'Offer' });
    const appliedCount = await Application.countDocuments({ status: 'Applied' });
    const oaCount = await Application.countDocuments({ status: 'Online Assessment' });
    const rejectedCount = await Application.countDocuments({ status: 'Rejected' });
    const wishlistCount = await Application.countDocuments({ status: 'Wishlist' });

    // 3. Application status distribution for pie chart
    const applicationStatusDistribution = [
      { name: 'Applied', value: appliedCount, color: '#3b82f6' },
      { name: 'Online Assessment', value: oaCount, color: '#eab308' },
      { name: 'Interview', value: interviewCount, color: '#8b5cf6' },
      { name: 'Offer', value: offerCount, color: '#22c55e' },
      { name: 'Rejected', value: rejectedCount, color: '#ef4444' },
      { name: 'Wishlist', value: wishlistCount, color: '#94a3b8' },
    ].filter((item) => item.value > 0 || totalApplications === 0);

    // 4. Overall preparation progress calculation
    // Weighted: 40% DSA solved, 30% Company prep completed, 15% Mock interview avg, 15% Profile completeness
    const dsaScore = totalDsa > 0 ? (solvedDsa / totalDsa) * 100 : 0;

    const companies = await CompanyPreparation.find();
    let companyScore = 0;
    if (companies.length > 0) {
      const sumPercentages = companies.reduce((acc, c) => acc + (c.progressPercentage || 0), 0);
      companyScore = sumPercentages / companies.length;
    }

    const mockInterviews = await MockInterview.find();
    let mockScore = 0;
    if (mockInterviews.length > 0) {
      const sumMock = mockInterviews.reduce((acc, m) => acc + (m.scorePercentage || 0), 0);
      mockScore = sumMock / mockInterviews.length;
    }

    const student = await Student.findOne();
    const profileScore = student?.completionPercentage || 0;

    const overallProgress = Math.round(
      dsaScore * 0.4 + companyScore * 0.3 + mockScore * 0.15 + profileScore * 0.15
    );

    // 5. DSA topic progress
    const dsaTopics = [
      'Arrays',
      'Strings',
      'Linked Lists',
      'Stacks and Queues',
      'Searching and Sorting',
      'Binary Trees',
      'Graphs',
      'Dynamic Programming',
    ];

    const dsaTopicAgg = await DsaQuestion.aggregate([
      {
        $group: {
          _id: '$topic',
          total: { $sum: 1 },
          solved: { $sum: { $cond: [{ $eq: ['$status', 'Solved'] }, 1, 0] } },
        },
      },
    ]);

    const topicMap = {};
    dsaTopicAgg.forEach((t) => {
      topicMap[t._id] = t;
    });

    const dsaTopicProgress = dsaTopics.map((topic) => {
      const d = topicMap[topic] || { total: 0, solved: 0 };
      return {
        topic,
        total: d.total,
        solved: d.solved,
        percentage: d.total > 0 ? Math.round((d.solved / d.total) * 100) : 0,
      };
    });

    // 6. Weekly study activity (last 7 days)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

      const dayActivities = await StudyActivity.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      const totalMinutes = dayActivities.reduce((sum, act) => sum + (act.minutesSpent || 0), 0);
      const hours = Number((totalMinutes / 60).toFixed(1));

      weeklyData.push({
        day: daysOfWeek[d.getDay()],
        date: `${d.getDate()}/${d.getMonth() + 1}`,
        hours: hours > 0 ? hours : 0,
        activitiesCount: dayActivities.length,
      });
    }

    // 7. Upcoming interviews
    const upcomingInterviews = await Application.find({
      $or: [
        { status: 'Interview' },
        { interviewDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      ],
    })
      .sort({ interviewDate: 1 })
      .limit(4);

    // 8. Recent applications
    const recentApplications = await Application.find().sort({ updatedAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        kpi: {
          totalDsa,
          solvedDsa,
          inProgressDsa,
          totalApplications,
          interviewsScheduled: interviewCount,
          offersReceived: offerCount,
          overallProgress,
          profileCompletion: profileScore,
        },
        weeklyActivity: weeklyData,
        dsaTopicProgress,
        applicationStatusDistribution,
        upcomingInterviews,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed preparation analytics
// @route   GET /api/analytics/preparation
exports.getPreparationAnalytics = async (req, res, next) => {
  try {
    // 1. Difficulty breakdown
    const diffAgg = await DsaQuestion.aggregate([
      {
        $group: {
          _id: '$difficulty',
          total: { $sum: 1 },
          solved: { $sum: { $cond: [{ $eq: ['$status', 'Solved'] }, 1, 0] } },
        },
      },
    ]);

    const difficultyBreakdown = ['Easy', 'Medium', 'Hard'].map((diff) => {
      const found = diffAgg.find((d) => d._id === diff) || { total: 0, solved: 0 };
      return {
        difficulty: diff,
        total: found.total,
        solved: found.solved,
        percentage: found.total > 0 ? Math.round((found.solved / found.total) * 100) : 0,
      };
    });

    // 2. Company prep progress
    const companies = await CompanyPreparation.find().select('companyName slug logoText badgeColor aptitudeTopics codingTopics technicalTopics hrQuestions');
    const companyProgress = companies.map((c) => ({
      name: c.companyName,
      slug: c.slug,
      badgeColor: c.badgeColor,
      progress: c.progressPercentage || 0,
    }));

    // 3. Mock interview trends
    const mockTrends = await MockInterview.find()
      .sort({ completedAt: 1 })
      .limit(10)
      .select('category scorePercentage averageConfidence completedAt');

    // 4. Study activity breakdown by category
    const activityTypes = await StudyActivity.aggregate([
      {
        $group: {
          _id: '$activityType',
          count: { $sum: 1 },
          totalMinutes: { $sum: '$minutesSpent' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        difficultyBreakdown,
        companyProgress,
        mockTrends: mockTrends.map((m, idx) => ({
          attempt: `Test ${idx + 1} (${m.category})`,
          score: m.scorePercentage,
          date: new Date(m.completedAt).toLocaleDateString(),
        })),
        activityDistribution: activityTypes.map((a) => ({
          type: a._id,
          count: a.count,
          hours: Number((a.totalMinutes / 60).toFixed(1)),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
