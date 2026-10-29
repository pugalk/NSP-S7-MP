import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'provider', 'verifier', 'organizer', 'admin'],
    default: 'student'
  },
  userIdentifier: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  organization: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  profile: {
    fullName: String,
    email: String,
    phone: String,
    dob: String,
    gender: String,
    state: String,
    district: String,
    address: String,
    community: String,
    institution: String,
    course: String,
    department: String,
    currentYear: String,
    registrationNumber: String,
    previousPercentage: String,
    cgpa: String,
    attendance: String,
    familyIncome: String,
    disability: Boolean,
    disabilityPercentage: String,
    residence: String,
    sportsAchievement: String,
    previousScholarship: String,
    previousScholarshipId: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
