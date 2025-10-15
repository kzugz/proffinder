import mongoose from 'mongoose';

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

export default mongoose.model('TeacherProfile', teacherProfileSchema);