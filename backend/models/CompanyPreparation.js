const mongoose = require('mongoose');

const companyPreparationSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    logoText: {
      type: String,
      default: '',
    },
    badgeColor: {
      type: String,
      default: '#2563eb',
    },
    overview: {
      type: String,
      default: '',
    },
    hiringTiers: {
      type: [String],
      default: [], // e.g. ["TCS Ninja (3.36 LPA)", "TCS Digital (7 LPA)", "TCS Prime (9 LPA)"]
    },
    recruitmentPattern: [
      {
        roundNumber: Number,
        roundName: String,
        details: String,
      },
    ],
    aptitudeTopics: [
      {
        id: String,
        topic: String,
        category: String, // Quantitative, Logical, Verbal
        completed: { type: Boolean, default: false },
      },
    ],
    codingTopics: [
      {
        id: String,
        topic: String,
        difficulty: String,
        completed: { type: Boolean, default: false },
      },
    ],
    technicalTopics: [
      {
        id: String,
        topic: String,
        completed: { type: Boolean, default: false },
      },
    ],
    hrQuestions: [
      {
        id: String,
        question: String,
        tip: String,
        completed: { type: Boolean, default: false },
      },
    ],
    studentNotes: {
      type: String,
      default: '',
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

companyPreparationSchema.virtual('progressPercentage').get(function () {
  const aptTotal = this.aptitudeTopics?.length || 0;
  const aptDone = this.aptitudeTopics?.filter((t) => t.completed).length || 0;

  const codeTotal = this.codingTopics?.length || 0;
  const codeDone = this.codingTopics?.filter((t) => t.completed).length || 0;

  const techTotal = this.technicalTopics?.length || 0;
  const techDone = this.technicalTopics?.filter((t) => t.completed).length || 0;

  const hrTotal = this.hrQuestions?.length || 0;
  const hrDone = this.hrQuestions?.filter((t) => t.completed).length || 0;

  const totalItems = aptTotal + codeTotal + techTotal + hrTotal;
  const doneItems = aptDone + codeDone + techDone + hrDone;

  if (totalItems === 0) return 0;
  return Math.round((doneItems / totalItems) * 100);
});

module.exports = mongoose.model('CompanyPreparation', companyPreparationSchema);
