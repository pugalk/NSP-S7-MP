import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getScholarships } from './scholarships.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const applicationsFilePath = path.join(__dirname, '../data/applications.json');

// Initial seed applications for demo
if (!fs.existsSync(applicationsFilePath)) {
  const initialApps = [
    {
      id: 'app_demo_01',
      applicationId: 'NSRP-2026-849201',
      scholarshipId: '1',
      scholarshipName: 'National Merit Excellence Scholarship',
      category: 'Merit-Based',
      amount: 50000,
      userEmail: 'student@nsp.gov.in',
      applicantName: 'Aravind Swaminathan',
      type: 'Fresh',
      status: 'Under Verification',
      submittedAt: '2026-08-10T11:30:00.000Z',
      updatedAt: '2026-08-25T14:20:00.000Z',
      bankDetails: {
        bankName: 'State Bank of India',
        accountNumber: 'XXXXXX4892',
        ifscCode: 'SBIN0001234'
      },
      remarks: 'Academic marksheets verified. Income document under district review.',
      nextAction: 'Awaiting provider review clearance.',
      history: [
        { status: 'Submitted', at: '2026-08-10T11:30:00.000Z', by: 'Student', remark: 'Initial submission' },
        { status: 'Document Verification', at: '2026-08-15T09:40:00.000Z', by: 'Nodal Officer', remark: 'All certificates accepted' },
        { status: 'Under Verification', at: '2026-08-25T14:20:00.000Z', by: 'District Welfare Officer', remark: 'Awaiting state quota clearance' }
      ]
    },
    {
      id: 'app_demo_02',
      applicationId: 'NSRP-2026-302194',
      scholarshipId: '2',
      scholarshipName: 'Central Sector Post-Matric Scholarship',
      category: 'Central Government',
      amount: 36000,
      userEmail: 'student@nsp.gov.in',
      applicantName: 'Aravind Swaminathan',
      type: 'Renewal',
      status: 'Approved',
      submittedAt: '2026-07-20T10:15:00.000Z',
      updatedAt: '2026-08-18T16:00:00.000Z',
      bankDetails: {
        bankName: 'State Bank of India',
        accountNumber: 'XXXXXX4892',
        ifscCode: 'SBIN0001234'
      },
      remarks: 'Renewal re-verification successful. Disbursal scheduled through PFMS.',
      nextAction: 'Disbursement details will be shared by the provider.',
      history: [
        { status: 'Submitted', at: '2026-07-20T10:15:00.000Z', by: 'Student', remark: 'Renewal application submitted' },
        { status: 'Document Verification', at: '2026-07-28T11:00:00.000Z', by: 'College Officer', remark: 'Attendance 88% verified' },
        { status: 'Under Verification', at: '2026-08-05T14:30:00.000Z', by: 'State Nodal Officer', remark: 'Promoted to year 3 with 8.4 CGPA' },
        { status: 'Provider Review', at: '2026-08-12T10:00:00.000Z', by: 'Ministry Officer', remark: 'Sanction approved' },
        { status: 'Approved', at: '2026-08-18T16:00:00.000Z', by: 'Finance Disbursal Unit', remark: 'Approved for PFMS DBT' }
      ]
    }
  ];
  fs.writeFileSync(applicationsFilePath, JSON.stringify(initialApps, null, 2));
}

const getApplications = () => JSON.parse(fs.readFileSync(applicationsFilePath, 'utf8'));
const saveApplications = (apps) => fs.writeFileSync(applicationsFilePath, JSON.stringify(apps, null, 2));

const STAGES = ['Submitted', 'Document Verification', 'Under Verification', 'Provider Review', 'Approved'];

// GET /api/applications
router.get('/', (req, res) => {
  const email = req.headers['x-user-email'];
  const all = getApplications();
  if (email && req.query.filterByUser !== 'false') {
    const userApps = all.filter(a => a.userEmail.toLowerCase() === email.toLowerCase());
    return res.json(userApps);
  }
  res.json(all);
});

// GET /api/applications/:id
router.get('/:id', (req, res) => {
  const all = getApplications();
  const app = all.find(a => a.id === req.params.id || a.applicationId === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  res.json(app);
});

// POST /api/applications
router.post('/', (req, res) => {
  const {
    scholarshipId,
    type = 'Fresh',
    applicantName,
    userEmail,
    bankDetails = {},
    documents = [],
    academicDetails = {},
    declaration = true
  } = req.body;

  if (!scholarshipId) {
    return res.status(400).json({ error: 'Scholarship ID is required' });
  }

  const scholarships = getScholarships();
  const scheme = scholarships.find(s => s.id === scholarshipId);

  const applications = getApplications();
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 899999);
  const applicationId = `NSRP-${year}-${randomNum}`;
  const now = new Date().toISOString();

  const newApp = {
    id: `app_${Date.now()}`,
    applicationId,
    scholarshipId,
    scholarshipName: scheme ? scheme.name : 'National Scholarship Scheme',
    category: scheme ? scheme.category : 'General',
    amount: scheme ? scheme.amount : 0,
    userEmail: userEmail || 'student@nsp.gov.in',
    applicantName: applicantName || 'Student Applicant',
    type: type === 'Renewal' ? 'Renewal' : 'Fresh',
    status: 'Submitted',
    submittedAt: now,
    updatedAt: now,
    bankDetails,
    academicDetails,
    documents,
    declaration,
    remarks: 'Application submitted successfully. Awaiting initial document screening.',
    nextAction: 'Nodal verification officer will screen certificates.',
    history: [
      {
        status: 'Submitted',
        at: now,
        by: 'Student',
        remark: `${type} application filed successfully.`
      }
    ]
  };

  applications.unshift(newApp);
  saveApplications(applications);

  res.status(201).json({
    success: true,
    application: newApp
  });
});

// PATCH /api/applications/:id/status (Admin / Review desk)
router.patch('/:id/status', (req, res) => {
  const { status, remarks, reviewer = 'Welfare Officer' } = req.body;
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === req.params.id || a.applicationId === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const app = applications[index];
  const now = new Date().toISOString();

  app.status = status;
  app.remarks = remarks || app.remarks;
  app.updatedAt = now;

  if (status === 'Approved') {
    app.nextAction = 'Disbursement details will be shared by the provider through PFMS.';
  } else if (status === 'Rejected') {
    app.nextAction = 'Application closed. Refer to reviewer remarks.';
  } else if (status === 'Resubmission Required') {
    app.nextAction = 'Re-upload corrected certificates on student portal.';
  } else {
    app.nextAction = 'Awaiting next level nodal review action.';
  }

  if (!app.history) app.history = [];
  app.history.push({
    status,
    at: now,
    by: reviewer,
    remark: remarks || `Status updated to ${status}`
  });

  saveApplications(applications);

  res.json({
    success: true,
    application: app
  });
});

// POST /api/applications/:id/advance (Test helper to simulate stage progression)
router.post('/:id/advance', (req, res) => {
  const applications = getApplications();
  const index = applications.findIndex(a => a.id === req.params.id || a.applicationId === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Application not found' });

  const app = applications[index];
  const curIdx = STAGES.indexOf(app.status);
  const nextStage = STAGES[Math.min(curIdx + 1, STAGES.length - 1)];

  app.status = nextStage;
  app.updatedAt = new Date().toISOString();
  saveApplications(applications);

  res.json({ success: true, application: app });
});

export default router;
