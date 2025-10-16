/**
* Authentication Middleware
* -------------------------
* Verifies JWT tokens and attaches the authenticated user to the request object.

* Usage:
* - Protect routes by adding authMiddleware before the route handler.

* Dependencies:
* - jsonwebtoken
* - User model
*/

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
* Middleware to protect routes and authenticate users.
* @param {Object} req - Express request object, expecting `Authorization` header with Bearer token.
* @param {Object} res - Express response object used to return 401 on unauthorized access.
* @param {Function} next - Express next middleware function.
* @returns {void} Calls next() if authentication succeeds, otherwise responds with 401.
*/
export const authMiddleware = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token is provided, deny access
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {

    // Verify JWT token and decode user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database excluding password field
    req.user = await User.findById(decoded.id).select('-password');

    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    
     // Token is invalid or expired
    res.status(401).json({ message: 'Token invalid' });
  }
};