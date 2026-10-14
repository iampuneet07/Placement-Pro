const Student = require('../models/Student');

// @desc    Get all students (or return demo profile if none exists)
// @route   GET /api/students
exports.getStudents = async (req, res, next) => {
  try {
    let students = await Student.find().sort({ createdAt: -1 });

    // If no student exists, return a fallback default demo structure without crashing
    if (students.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: 'No student profiles found. You can load demo data or create a new profile.',
      });
    }

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student profile (or default demo profile)
// @route   GET /api/students/:id
exports.getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let student;
    if (id === 'default' || id === 'demo') {
      student = await Student.findOne().sort({ createdAt: -1 });
    } else {
      student = await Student.findById(id);
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create student profile
// @route   POST /api/students
exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Student profile created successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/students/:id
exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    let student;

    if (id === 'default' || id === 'demo') {
      student = await Student.findOne();
      if (student) {
        student = await Student.findByIdAndUpdate(student._id, req.body, {
          new: true,
          runValidators: true,
        });
      }
    } else {
      student = await Student.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    if (!student) {
      // If none existed, create one
      student = await Student.create(req.body);
    }

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully in MongoDB',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student profile
// @route   DELETE /api/students/:id
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Student profile deleted successfully from MongoDB',
    });
  } catch (error) {
    next(error);
  }
};
