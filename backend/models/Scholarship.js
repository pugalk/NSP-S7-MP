import mongoose from 'mongoose';

const ScholarshipSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  provider: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, default: '' },
  closingDate: { type: String, default: '' },
  active: { type: Boolean, default: true },
  minPercentage: { type: Number, default: 0 },
  minCgpa: { type: Number, default: 0 },
  minAttendance: { type: Number, default: 0 },
  maxFamilyIncome: { type: Number, default: 0 },
  genderPreference: { type: String, default: 'All' },
  eligibleStates: [{ type: String }],
  eligibleCourses: [{ type: String }],
  eligibleCommunities: [{ type: String }],
  documentsRequired: [{ type: String }],
  schemeDetails: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.models.Scholarship || mongoose.model('Scholarship', ScholarshipSchema);
