/**
* Teacher Controller
* -------------------
* Handles all teacher-related operations, including:
* - Creating teacher profiles
* - Retrieving all teachers (with filtering)
* - Fetching teachers by ID
* - Rating teachers

* Exports:
* - createTeacherProfile
* - getTeachers
* - getTeacherById
* - rateTeacher

* Dependencies:
* - mongoose
* - TeacherProfile model
* - User model
*/

import mongoose from 'mongoose';
import TeacherProfile from '../models/TeacherProfile.js';
import User from '../models/User.js';

/**
* Creates a new teacher profile for the authenticated user.
* @route POST /api/teachers/profile
* @access Private (teacher only)
* @param {Object} req - Express request containing user data and profile fields (subjects, bio, pricePerHour).
* @param {Object} res - Express response object.
* @returns {JSON} Newly created teacher profile.
* @throws {403} If user role is not 'teacher'.
* @throws {400} If profile already exists.
* @throws {500} On server error.
*/
export const createTeacherProfile = async (req, res) => {
  try {
    
    // Validate user role to ensure only teachers can create profiles
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
      ratings: [], // Initialize empty ratings array for future student evaluations
    });

    res.status(201).json({ message: 'Profile created', profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
* Retrieves a list of teachers, optionally filtered by subject, price range, or name.
* @route GET /api/teachers
* @access Public
* @param {Object} req - Express request with optional query params: subject, minPrice, maxPrice, name.
* @param {Object} res - Express response containing a list of teacher profiles.
* @returns {JSON} Array of teacher profiles with populated user info.
* @throws {500} On server error.
*/
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
      query = query.where('user.name', new RegExp(name, 'i')); // Case-insensitive search by teacher name using RegExp
    }

    const teachers = await query;
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
* Retrieves a specific teacher profile by ID.
* @route GET /api/teachers/:id
* @access Public
* @param {Object} req - Express request containing teacher ID in params.
* @param {Object} res - Express response containing teacher profile data.
* @returns {JSON} Teacher profile with populated user info.
* @throws {400} If teacher ID is invalid.
* @throws {404} If teacher is not found.
* @throws {500} On server error.
*/
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

/**
* Allows a student to rate a teacher and add an optional comment.
* @route POST /api/teachers/:id/rate
* @access Private (student only)
* @param {Object} req - Express request containing rating (1–5) and comment.
* @param {Object} res - Express response containing updated ratings.
* @returns {JSON} Confirmation message with updated ratings array.
* @throws {403} If user role is not 'student'.
* @throws {400} If rating is invalid or teacher ID is invalid.
* @throws {404} If teacher is not found.
* @throws {500} On server error.
*/
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