/**
* Authentication Controller
* --------------------------
* Handles user registration, login, and deletion.

* Exports:
* - registerUser: Registers a new user.
* - loginUser: Authenticates a user and returns a JWT.
* - deleteUser: Deletes a user (admin only).

* Dependencies:
* - User model
* - bcryptjs for password hashing
* - jsonwebtoken for JWT generation
*/

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
* Registers a new user.
* @route POST /api/auth/register
* @param {Object} req - Express request object containing name, email, password, role.
* @param {Object} res - Express response object.
* @returns {JSON} Success or error message.
* @throws {400} If email is already registered.
* @throws {500} On server error.
*/
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

/**
* Authenticates a user and returns a JWT token.
* @route POST /api/auth/login
* @param {Object} req - Express request with email and password.
* @param {Object} res - Express response with JWT token.
* @returns {JSON} Login success message with token.
* @throws {400} If credentials are invalid.
* @throws {500} On server error.
*/
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
    
    // Generate JWT token with user ID and role, valid for 1 day
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ message: 'Successful login', token });
  } catch (err) {
    console.error("Login error:", err.message); // Debugging line
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
* Deletes a user by ID (admin only).
* @route DELETE /api/auth/:id
* @param {Object} req - Express request with user ID in params.
* @param {Object} res - Express response object.
* @returns {JSON} Deletion confirmation message.
* @throws {404} If user is not found.
* @throws {500} On server error.
*/
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