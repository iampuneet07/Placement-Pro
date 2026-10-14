const mongoose = require('mongoose');

const mockQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['DSA', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'HR', 'Aptitude'],
    },
    questionType: {
      type: String,
      enum: ['mcq', 'subjective'],
      default: 'subjective',
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      default: [], // Only for MCQ
    },
    correctAnswerIndex: {
      type: Number,
      default: null, // Index of correct option for MCQ
    },
    keyAnswerPoints: {
      type: [String],
      default: [], // Expected keywords / points for rule-based feedback
    },
    sampleAnswer: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MockQuestion', mockQuestionSchema);
