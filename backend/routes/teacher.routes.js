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

// Test Route
router.get('/test', (req, res) => {
  res.send('Teachers route working!');
});

// Create teacher profile (teachers only)
router.post("/", authMiddleware, roleMiddleware(["teacher"]), createTeacherProfile);

// List all teachers (students and admins)
router.get("/", authMiddleware, roleMiddleware(["student", "admin"]), getTeachers);

// Query profile by ID (any authenticated user, or public if you wish)
router.get("/:id", authMiddleware, getTeacherById);

// Teacher rating (students only)
router.post("/:id/rate", authMiddleware, roleMiddleware(["student"]), rateTeacher);

export default router;