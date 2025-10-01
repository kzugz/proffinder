import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import teacherRoutes from './routes/teacher.routes.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);

// MongoDB Connection
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});