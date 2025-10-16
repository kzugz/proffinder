/**
* User Model
* -----------
* Represents a user in the system.

* Fields:
* - name: Full name of the user (required)
* - email: Unique email for login (required)
* - password: Hashed password (required)
* - role: User role, either 'student' or 'teacher' (required)
* - avatar: URL to profile image (optional)
* - phone: Contact phone number (optional)
* - createdAt: Timestamp of account creation
* - isActive: Boolean indicating if the user account is active

* Hooks:
* - pre('save') to hash password before saving to database

* Methods:
* - comparePassword(candidatePassword): Compares a plaintext password with the hashed password
*/

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({

  // Full name of the user
  name: { type: String, required: true },

  // Unique email used for login
  email: { type: String, required: true, unique: true },

  // Hashed password stored securely
  password: { type: String, required: true },

  // User role (student or teacher)
  role: { type: String, enum: ['student', 'teacher'], required: true },

  // URL of profile avatar image
  avatar: { type: String, default: '' },

  // Contact phone number
  phone: { type: String },

  // Timestamp when user was created
  createdAt: { type: Date, default: Date.now },

  // Indicates if the user account is active
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {

  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();
  try {

    // Generate a salt for hashing
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare a candidate password with the stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Exports the User model for use in authentication and user management.
export default mongoose.model('User', userSchema);