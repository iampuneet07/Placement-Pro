const mongoose = require('mongoose');

const studyActivitySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    activityType: {
      type: String,
      required: true,
      enum: ['DSA Practice', 'Company Prep', 'Mock Interview', 'Application Submitted'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      default: '',
    },
    minutesSpent: {
      type: Number,
      default: 30,
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

studyActivitySchema.index({ date: -1 });

module.exports = mongoose.model('StudyActivity', studyActivitySchema);
