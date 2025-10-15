import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password }); // Debugging line

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email); // Debugging line
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("User found:", user.email); // Debugging line
    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch); // Debugging line

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
      
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ message: 'Successful login', token });
  } catch (err) {
    console.error("Login error:", err.message); // Debugging line
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete user by ID (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};