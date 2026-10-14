const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['DSA', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'HR', 'Aptitude'],
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 5,
    },
    scorePercentage: {
      type: Number,
      default: 0,
    },
    averageConfidence: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    feedbackSummary: {
      type: String,
      default: '',
    },
    responses: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MockQuestion',
        },
        questionText: String,
        questionType: String,
        userAnswer: String,
        selectedOptionIndex: Number,
        isCorrect: Boolean,
        confidence: {
          type: String,
          enum: ['Low', 'Medium', 'High'],
          default: 'Medium',
        },
        matchedKeywords: [String],
        feedback: String,
      },
    ],
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

mockInterviewSchema.index({ category: 1, completedAt: -1 });

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
