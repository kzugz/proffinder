import mongoose from 'mongoose';
import TeacherProfile from '../models/TeacherProfile.js';
import User from '../models/User.js';

// Create teacher profile
export const createTeacherProfile = async (req, res) => {
  try {
    // Only teachers can create profiles
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create profiles' });
    }

    const { subjects, bio, pricePerHour } = req.body;
    const userId = req.user.id;

    // Check if profile already exists
    const existingProfile = await TeacherProfile.findOne({ user: userId });
    if (existingProfile) return res.status(400).json({ message: 'Profile already exists' });

    const profile = await TeacherProfile.create({
      user: userId,
      subjects,
      bio,
      pricePerHour,
      ratings: [], // Initialize empty ratings array
    });

    res.status(201).json({ message: 'Profile created', profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List all teachers (with optional filter by subject)
export const getTeachers = async (req, res) => {
  try {
    const { subject, minPrice, maxPrice, name } = req.query;

    let filter = {};

    if (subject) filter.subjects = { $in: [subject] };
    if (minPrice || maxPrice) {
      filter.pricePerHour = {};
      if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
    }

    let query = TeacherProfile.find(filter).populate('user', 'name email');

    if (name) {
      query = query.where('user.name', new RegExp(name, 'i')); // Case-insensitive regex search
    }

    const teachers = await query;
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Search teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

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
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can rate teachers' });
    }

    const { id } = req.params; // Teacher profile ID
    const { rating, comment } = req.body;
    const studentId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    const teacher = await TeacherProfile.findById(id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    teacher.ratings.push({ student: studentId, rating, comment });
    await teacher.save();

    res.json({ message: 'Rating added', ratings: teacher.ratings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};