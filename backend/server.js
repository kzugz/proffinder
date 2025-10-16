/**
* Server Entry Point
* ------------------
* Initializes and starts the Express server.
*
* Responsibilities:
* - Load environment variables via dotenv
* - Connect to MongoDB using connectDB
* - Setup global middlewares (CORS, JSON parser)
* - Register API routes
* - Start server on specified PORT
*
* Dependencies:
* - express
* - cors
* - dotenv
* - MongoDB connection module
* - authRoutes
* - teacherRoutes
*/

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import teacherRoutes from './routes/teacher.routes.js';

// Load environment variables from .env file
dotenv.config();

// Define port from environment or default to 3000
const PORT = process.env.PORT || 3000;

// Initialize Express application
const app = express();

// --------------------
// Global Middleware
// --------------------

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// --------------------
// Routes
// --------------------

// Authentication routes
app.use('/api/auth', authRoutes);

// Teacher-related routes
app.use('/api/teachers', teacherRoutes);

// --------------------
// Database Connection and Server Startup
// --------------------

// Connect to MongoDB and start the server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});