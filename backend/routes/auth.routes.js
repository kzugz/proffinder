/**
* Auth Routes
* ------------
* Handles user authentication routes, including registration, login, and deletion.

* Routes:
* - POST /register: Registers a new user
* - POST /login: Logs in an existing user and returns a JWT
* - DELETE /delete/:id: Deletes a user (admin only)

* Dependencies:
* - Express Router
* - auth.controller.js
*/

import express from 'express';
import { registerUser, loginUser, deleteUser } from '../controllers/auth.controller.js';

const router = express.Router();

/**
* @route POST /api/auth/register
* @desc Register a new user
* @access Public
*/
router.post('/register', registerUser);

/**
* @route POST /api/auth/login
* @desc Authenticate user and return JWT token
* @access Public
*/
router.post('/login', loginUser);

/**
* @route DELETE /api/auth/delete/:id
* @desc Delete a user by ID
* @access Private (admin only)
*/
router.delete('/delete/:id', deleteUser);

export default router;