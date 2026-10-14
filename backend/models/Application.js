const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Internship', 'Intern + PPO'],
      default: 'Full-time',
    },
    location: {
      type: String,
      trim: true,
      default: 'Pan India',
    },
    salaryPackage: {
      type: String,
      trim: true,
      default: '',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['Wishlist', 'Applied', 'Online Assessment', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    jobUrl: {
      type: String,
      trim: true,
      default: '',
    },
    recruiterNotes: {
      type: String,
      trim: true,
      default: '',
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
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
  }
);

applicationSchema.index({ company: 1, status: 1 });
applicationSchema.index({ applicationDate: -1 });

module.exports = mongoose.model('Application', applicationSchema);
