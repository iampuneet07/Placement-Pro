const mongoose = require('mongoose');

const dsaQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      enum: [
        'Arrays',
        'Strings',
        'Linked Lists',
        'Stacks and Queues',
        'Searching and Sorting',
        'Binary Trees',
        'Graphs',
        'Dynamic Programming',
      ],
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    companyTags: {
      type: [String],
      default: [],
    },
    practiceUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Solved'],
      default: 'Not Started',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    solvedAt: {
      type: Date,
      default: null,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching and filtering
dsaQuestionSchema.index({ topic: 1, difficulty: 1, status: 1 });
dsaQuestionSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('DsaQuestion', dsaQuestionSchema);
