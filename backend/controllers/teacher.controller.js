import TeacherProfile from '../models/TeacherProfile.js';
import User from '../models/User.js';

// Create teacher profile
export const createTeacherProfile = async (req, res) => {
  try {
    const { subjects, bio, pricePerHour } = req.body;
    const userId = req.user.id;

    const existingProfile = await TeacherProfile.findOne({ user: userId });
    if (existingProfile) return res.status(400).json({ message: 'Profile already exists' });

    const profile = await TeacherProfile.create({
      user: userId,
      subjects,
      bio,
      pricePerHour
    });

    res.status(201).json({ message: 'Profile created', profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List all teachers (with optional filter by subject)
export const getTeachers = async (req, res) => {
  try {
    const { subject } = req.query;
    let filter = {};
    if (subject) filter.subjects = { $in: [subject] };

    const teachers = await TeacherProfile.find(filter).populate('user', 'name email');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Search teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await TeacherProfile.findById(id).populate('user', 'name email');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Rate teacher
export const rateTeacher = async (req, res) => {
  try {
    const { id } = req.params; // Teacher profile ID
    const { rating, comment } = req.body;
    const studentId = req.user.id;

    const teacher = await TeacherProfile.findById(id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    teacher.ratings.push({ student: studentId, rating, comment });
    await teacher.save();

    res.json({ message: 'Rating added', ratings: teacher.ratings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};