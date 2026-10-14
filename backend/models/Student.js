const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
    },
    degreeBranch: {
      type: String,
      required: [true, 'Degree and Branch are required'],
      trim: true,
      default: 'B.Tech Computer Science & Engineering',
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
      min: [2020, 'Year must be 2020 or later'],
      max: [2035, 'Year cannot exceed 2035'],
      default: 2025,
    },
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0, 'CGPA cannot be less than 0'],
      max: [10, 'CGPA cannot exceed 10'],
      default: 8.5,
    },
    skills: {
      type: [String],
      default: [],
    },
    preferredRole: {
      type: String,
      trim: true,
      default: 'Software Development Engineer (SDE)',
    },
    preferredCompanies: {
      type: [String],
      default: [],
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: 'https://drive.google.com/sample-resume',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: 'https://github.com/demo-student',
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: 'https://linkedin.com/in/demo-student',
    },
    bio: {
      type: String,
      trim: true,
      default: 'Final year CSE undergraduate passionate about Full Stack Web Development and Algorithms.',
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating profile completion percentage
studentSchema.virtual('completionPercentage').get(function () {
  let score = 0;
  const total = 10;
  if (this.name) score++;
  if (this.email) score++;
  if (this.college) score++;
  if (this.degreeBranch) score++;
  if (this.graduationYear) score++;
  if (this.cgpa) score++;
  if (this.skills && this.skills.length > 0) score++;
  if (this.preferredRole) score++;
  if (this.preferredCompanies && this.preferredCompanies.length > 0) score++;
  if (this.resumeUrl) score++;
  return Math.round((score / total) * 100);
});

module.exports = mongoose.model('Student', studentSchema);
