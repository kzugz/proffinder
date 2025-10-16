/**
* Teacher Routes
* ----------------
* Handles teacher-related API routes, including:
* - Creating teacher profiles
* - Listing teachers
* - Querying a teacher by ID
* - Rating teachers
*
* All routes are protected by authMiddleware and optionally roleMiddleware
* depending on the endpoint.
*
* Dependencies:
* - teacher.controller.js
* - authMiddleware
* - roleMiddleware
*/

import express from 'express';
import {
  createTeacherProfile,
  getTeachers,
  getTeacherById,
  rateTeacher,
} from '../controllers/teacher.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

/**
* @route GET /api/teachers/test
* @desc Test route to verify teacher routes are working
* @access Public
*/
router.get('/test', (req, res) => {
  res.send('Teachers route working!');
});

/**
* @route POST /api/teachers
* @desc Create a new teacher profile
* @access Private (teachers only)
*/
router.post("/", authMiddleware, roleMiddleware(["teacher"]), createTeacherProfile);

/**
* @route GET /api/teachers
* @desc List all teacher profiles, optionally filtered by query params
* @access Private (students and admins)
*/
router.get("/", authMiddleware, roleMiddleware(["student", "admin"]), getTeachers);

/**
* @route GET /api/teachers/:id
* @desc Retrieve a teacher profile by ID
* @access Private (any authenticated user)
*/
router.get("/:id", authMiddleware, getTeacherById);

/**
* @route POST /api/teachers/:id/rate
* @desc Submit a rating and comment for a teacher
* @access Private (students only)
*/
router.post("/:id/rate", authMiddleware, roleMiddleware(["student"]), rateTeacher);

export default router;