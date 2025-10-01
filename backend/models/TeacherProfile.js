const mongoose = require('mongoose');

const teacherProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjects: [{ type: String }],
  bio: String,
  pricePerHour: Number,
  ratings: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String
  }],
});

module.exports = mongoose.model('TeacherProfile', teacherProfileSchema);