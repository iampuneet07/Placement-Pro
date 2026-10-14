const Student = require('../models/Student');
const DsaQuestion = require('../models/DsaQuestion');
const CompanyPreparation = require('../models/CompanyPreparation');
const Application = require('../models/Application');
const MockQuestion = require('../models/MockQuestion');
const MockInterview = require('../models/MockInterview');
const StudyActivity = require('../models/StudyActivity');

const {
  demoStudent,
  dsaQuestions,
  companiesData,
  applicationsData,
  mockQuestions,
  initialStudyActivities,
} = require('./seedData');

/**
 * Idempotently seed or update database records without creating duplicates.
 */
const seedDatabase = async () => {
  console.log('🌱 Starting idempotent database seeding...');

  // 1. Seed or update Demo Student
  const student = await Student.findOneAndUpdate(
    { email: demoStudent.email },
    demoStudent,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`👤 Student seeded: ${student.name} (${student.email})`);

  // 2. Seed DSA Questions
  let dsaUpserted = 0;
  for (const q of dsaQuestions) {
    await DsaQuestion.findOneAndUpdate(
      { title: q.title },
      { ...q, studentId: student._id },
      { upsert: true, setDefaultsOnInsert: true }
    );
    dsaUpserted++;
  }
  console.log(`📚 DSA Questions seeded/verified: ${dsaUpserted} items`);

  // 3. Seed Company Preparation Guides
  let companyUpserted = 0;
  for (const c of companiesData) {
    await CompanyPreparation.findOneAndUpdate(
      { slug: c.slug },
      { ...c, studentId: student._id },
      { upsert: true, setDefaultsOnInsert: true }
    );
    companyUpserted++;
  }
  console.log(`🏢 Company Prep Guides seeded/verified: ${companyUpserted} companies`);

  // 4. Seed Applications
  let appUpserted = 0;
  for (const a of applicationsData) {
    await Application.findOneAndUpdate(
      { company: a.company, role: a.role },
      { ...a, studentId: student._id },
      { upsert: true, setDefaultsOnInsert: true }
    );
    appUpserted++;
  }
  console.log(`📝 Placement Applications seeded/verified: ${appUpserted} applications`);

  // 5. Seed Mock Interview Question Bank
  let mockQUpserted = 0;
  for (const mq of mockQuestions) {
    await MockQuestion.findOneAndUpdate(
      { questionText: mq.questionText },
      mq,
      { upsert: true, setDefaultsOnInsert: true }
    );
    mockQUpserted++;
  }
  console.log(`💡 Mock Questions seeded/verified: ${mockQUpserted} questions in bank`);

  // 6. Seed Study Activity Logs if none exist
  const existingActivities = await StudyActivity.countDocuments();
  if (existingActivities === 0) {
    await StudyActivity.insertMany(
      initialStudyActivities.map((act) => ({ ...act, studentId: student._id }))
    );
    console.log(`⏱️ Study activities seeded: ${initialStudyActivities.length} logs`);
  } else {
    console.log(`⏱️ Study activities verified: ${existingActivities} logs exist`);
  }

  // 7. Seed sample Mock Interview attempt if none exists
  const existingInterviews = await MockInterview.countDocuments();
  if (existingInterviews === 0) {
    await MockInterview.create({
      category: 'JavaScript',
      totalQuestions: 4,
      scorePercentage: 85,
      averageConfidence: 'High',
      feedbackSummary: 'Outstanding performance! Demonstrates strong grasp of ES6+, closures, and hoisting.',
      studentId: student._id,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      responses: [
        {
          questionText: 'Explain the difference between let, const, and var in JavaScript regarding scope and hoisting.',
          questionType: 'subjective',
          userAnswer: 'let and const have block scope and temporal dead zone. var has function scope and gets hoisted with undefined.',
          isCorrect: true,
          confidence: 'High',
          feedback: '🎯 Strong answer! You correctly touched on core concepts: [block scope, hoisting, temporal dead zone].',
        },
        {
          questionText: 'What will "typeof NaN" return in JavaScript?',
          questionType: 'mcq',
          selectedOptionIndex: 2,
          isCorrect: true,
          confidence: 'High',
          feedback: '✅ Excellent! Correct answer selected.',
        },
      ],
    });
    console.log(`🎯 Sample completed mock interview attempt seeded`);
  }

  console.log('✅ Idempotent database seeding completed successfully!');
  return {
    studentCount: 1,
    dsaCount: dsaUpserted,
    companyCount: companyUpserted,
    applicationCount: appUpserted,
    mockQuestionCount: mockQUpserted,
  };
};

/**
 * Reset all collections to clean demo state
 */
const resetDatabase = async () => {
  console.log('⚠️ Resetting database to default demo state...');
  await Student.deleteMany({});
  await DsaQuestion.deleteMany({});
  await CompanyPreparation.deleteMany({});
  await Application.deleteMany({});
  await MockQuestion.deleteMany({});
  await MockInterview.deleteMany({});
  await StudyActivity.deleteMany({});
  return await seedDatabase();
};

module.exports = { seedDatabase, resetDatabase };
