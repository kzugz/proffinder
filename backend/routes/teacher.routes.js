import express from 'express';
import { getTeachers } from '../controllers/teacher.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Test Route
router.get('/test', (req, res) => {
  res.send('Teachers route working!');
});

router.get("/", authMiddleware, roleMiddleware(["student", "admin"]), getTeachers);

export default router;