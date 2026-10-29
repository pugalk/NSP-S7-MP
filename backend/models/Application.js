import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  scholarshipId: { type: String, required: true },
  scholarshipName: { type: String, required: true },
  category: { type: String, default: 'General' },
  amount: { type: Number, default: 0 },
  userEmail: { type: String, required: true },
  applicantName: { type: String, required: true },
  type: { type: String, enum: ['Fresh', 'Renewal'], default: 'Fresh' },
  status: {
    type: String,
    enum: ['Submitted', 'Document Verification', 'Under Verification', 'Provider Review', 'Approved', 'Rejected', 'Resubmission Required'],
    default: 'Submitted'
  },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String
  },
  academicDetails: {
    percentage: String,
    cgpa: String,
    attendance: String
  },
  remarks: { type: String, default: '' },
  nextAction: { type: String, default: '' },
  history: [
    {
      status: String,
      at: { type: Date, default: Date.now },
      by: String,
      remark: String
    }
  ]
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
