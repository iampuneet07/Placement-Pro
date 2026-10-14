const MockQuestion = require('../models/MockQuestion');
const MockInterview = require('../models/MockInterview');
const StudyActivity = require('../models/StudyActivity');

// @desc    Get questions for mock interview by category
// @route   GET /api/mock-interviews/questions
exports.getMockQuestions = async (req, res, next) => {
  try {
    const { category, limit = 5 } = req.query;
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const count = await MockQuestion.countDocuments(filter);
    const questions = await MockQuestion.find(filter).limit(Number(limit));

    res.status(200).json({
      success: true,
      totalAvailable: count,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Evaluate mock interview submission, provide rule-based feedback, and save to MongoDB
// @route   POST /api/mock-interviews/evaluate
exports.evaluateAndSaveSession = async (req, res, next) => {
  try {
    const { category, responses } = req.body;
    // responses: [{ questionId, questionText, questionType, userAnswer, selectedOptionIndex, confidence }]

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No answers provided for evaluation',
      });
    }

    let earnedScore = 0;
    const maxScore = responses.length * 10;
    const evaluatedResponses = [];

    for (const resp of responses) {
      const qDoc = resp.questionId ? await MockQuestion.findById(resp.questionId) : null;
      let isCorrect = false;
      let qScore = 0;
      let matchedKeywords = [];
      let feedback = '';

      if (resp.questionType === 'mcq' && qDoc) {
        if (resp.selectedOptionIndex === qDoc.correctAnswerIndex) {
          isCorrect = true;
          qScore = 10;
          feedback = `✅ Excellent! Correct answer selected. ${qDoc.sampleAnswer || ''}`;
        } else {
          isCorrect = false;
          qScore = 2; // small partial credit for attempting
          feedback = `❌ Incorrect selection. The right answer is: "${qDoc.options[qDoc.correctAnswerIndex]}". Explanation: ${qDoc.sampleAnswer || 'Review this concept.'}`;
        }
      } else {
        // Subjective question evaluation based on key terms & length
        const userText = (resp.userAnswer || '').toLowerCase().trim();
        const expectedKeys = (qDoc?.keyAnswerPoints || []).map((k) => k.toLowerCase());

        expectedKeys.forEach((key) => {
          if (userText.includes(key)) {
            matchedKeywords.push(key);
          }
        });

        const wordCount = userText.split(/\s+/).filter(Boolean).length;

        if (wordCount < 5) {
          qScore = 2;
          feedback = '⚠️ Answer is too brief. Try to articulate technical concepts with definitions, examples, and trade-offs.';
        } else if (expectedKeys.length > 0 && matchedKeywords.length >= Math.ceil(expectedKeys.length * 0.6)) {
          qScore = 10;
          isCorrect = true;
          feedback = `🎯 Strong answer! You correctly touched on core concepts: [${matchedKeywords.join(', ')}].`;
        } else if (matchedKeywords.length > 0) {
          qScore = 7;
          feedback = `👍 Good attempt! You mentioned key points like [${matchedKeywords.join(', ')}], but could expand more on practical implementation.`;
        } else {
          qScore = 5;
          feedback = `📝 Answer recorded. To impress the interviewer, consider mentioning core terminology: [${expectedKeys.slice(0, 3).join(', ')}].`;
        }

        // Adjust slightly based on self-confidence
        if (resp.confidence === 'High' && qScore >= 7) {
          feedback += ' Your confidence matches your solid understanding.';
        } else if (resp.confidence === 'Low') {
          feedback += ' Reviewing this topic once more will boost your confidence in technical rounds.';
        }
      }

      earnedScore += qScore;
      evaluatedResponses.push({
        questionId: resp.questionId || null,
        questionText: resp.questionText || qDoc?.questionText || 'Interview Question',
        questionType: resp.questionType || (qDoc?.questionType ?? 'subjective'),
        userAnswer: resp.userAnswer || '',
        selectedOptionIndex: resp.selectedOptionIndex,
        isCorrect,
        confidence: resp.confidence || 'Medium',
        matchedKeywords,
        feedback,
      });
    }

    const scorePercentage = Math.round((earnedScore / maxScore) * 100);

    // Compute average confidence
    const confCounts = { High: 0, Medium: 0, Low: 0 };
    responses.forEach((r) => {
      if (r.confidence && confCounts[r.confidence] !== undefined) {
        confCounts[r.confidence]++;
      }
    });
    let averageConfidence = 'Medium';
    if (confCounts.High >= confCounts.Medium && confCounts.High >= confCounts.Low) averageConfidence = 'High';
    if (confCounts.Low > confCounts.High && confCounts.Low > confCounts.Medium) averageConfidence = 'Low';

    let feedbackSummary = '';
    if (scorePercentage >= 80) {
      feedbackSummary = 'Outstanding performance! You are well-prepared for technical placement rounds in this topic.';
    } else if (scorePercentage >= 60) {
      feedbackSummary = 'Good grasp of essentials. Focus on edge cases and deeper technical terminology to stand out.';
    } else {
      feedbackSummary = 'Foundation established. We recommend revisiting the core fundamentals and practicing structured explanations.';
    }

    const session = await MockInterview.create({
      category: category || 'DSA',
      totalQuestions: responses.length,
      scorePercentage,
      averageConfidence,
      feedbackSummary,
      responses: evaluatedResponses,
    });

    // Log study activity
    await StudyActivity.create({
      activityType: 'Mock Interview',
      title: `Completed ${category} Mock Interview`,
      details: `Scored ${scorePercentage}% across ${responses.length} questions.`,
      minutesSpent: 30,
    }).catch((err) => console.log('Activity log notice:', err.message));

    res.status(201).json({
      success: true,
      message: 'Mock interview session evaluated and saved to MongoDB',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get mock interview session history
// @route   GET /api/mock-interviews
exports.getMockInterviewHistory = async (req, res, next) => {
  try {
    const history = await MockInterview.find().sort({ completedAt: -1 }).limit(20);
    const totalSessions = await MockInterview.countDocuments();
    
    // Average score calculation
    const avgScoreAgg = await MockInterview.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$scorePercentage' } } },
    ]);
    const overallAvgScore = avgScoreAgg.length > 0 ? Math.round(avgScoreAgg[0].avgScore) : 0;

    res.status(200).json({
      success: true,
      count: history.length,
      stats: {
        totalSessions,
        overallAvgScore,
      },
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single mock interview session by ID
// @route   GET /api/mock-interviews/:id
exports.getMockInterviewById = async (req, res, next) => {
  try {
    const session = await MockInterview.findById(req.params.id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Mock interview session not found',
      });
    }
    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};
