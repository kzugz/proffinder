import User from '../models/User.js';

// Search for your own profile
export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};