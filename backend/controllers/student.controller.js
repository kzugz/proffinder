/**
* Student Controller
* -------------------
* Handles student-related operations, such as retrieving the logged-in student's profile.

* Exports:
* - getStudentProfile: Returns the authenticated student's profile.

* Dependencies:
* - User model
*/

import User from '../models/User.js';

/**
* Retrieves the authenticated student's profile.
* @route GET /api/students/profile
* @access Private (requires authentication)
* @param {Object} req - Express request object containing authenticated user info (req.user).
* @param {Object} res - Express response object used to send the profile data.
* @returns {JSON} Student profile data without password field.
* @throws {404} If student is not found.
* @throws {500} On server error.
*/
export const getStudentProfile = async (req, res) => {
  try {
    
    // Exclude password field before sending response
    const student = await User.findById(req.user.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};