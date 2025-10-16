/**
* TeacherProfile Model
* -------------------
* Represents a teacher's profile in the system.
 
* Fields:
* - user: Reference to the User who owns this profile (required)
* - subjects: Array of subjects the teacher teaches
* - bio: Short biography or description of the teacher
* - pricePerHour: Hourly rate for lessons
* - ratings: Array of ratings submitted by students, each containing:
*  - student: Reference to the User who rated
*  - rating: Numeric rating (1-5)
*  - comment: Optional text comment

* This model is used in conjunction with User for authentication
* and in teacher-related controllers.
*/

import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema({
  // Reference to the user who owns the profile
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // List of subjects the teacher can teach
  subjects: [{ type: String }],

  // Short biography of the teacher
  bio: String,

  // Hourly rate in the local currency
  pricePerHour: Number,

  // Array of ratings given by students
  ratings: [{

    // Reference to the student who rated
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Rating score (1-5)
    rating: Number,
    
    // Optional textual comment from the student
    comment: String
  }],
});

// Exports the TeacherProfile model for use in controllers.
export default mongoose.model('TeacherProfile', teacherProfileSchema);