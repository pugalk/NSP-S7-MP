import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const docsFilePath = path.join(__dirname, '../data/documents.json');
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Initial sample documents
if (!fs.existsSync(docsFilePath)) {
  const initialDocs = [
    {
      id: 'doc_1',
      name: 'Aadhaar / Identity Document',
      fileName: 'aadhaar_card_verified.pdf',
      size: 421000,
      userEmail: 'student@nsp.gov.in',
      uploadedAt: '2026-08-10T11:20:00.000Z',
      status: 'Verified',
      remark: 'Aadhaar UID and DOB match government records.'
    },
    {
      id: 'doc_2',
      name: 'Marksheet',
      fileName: 'semester_4_grade_sheet.pdf',
      size: 785000,
      userEmail: 'student@nsp.gov.in',
      uploadedAt: '2026-08-10T11:22:00.000Z',
      status: 'Verified',
      remark: '8.4 CGPA confirmed with Anna University database.'
    },
    {
      id: 'doc_3',
      name: 'Income Certificate',
      fileName: 'revenue_dept_income_cert.pdf',
      size: 512000,
      userEmail: 'student@nsp.gov.in',
      uploadedAt: '2026-08-10T11:25:00.000Z',
      status: 'Pending Verification',
      remark: 'Under physical verification at Tehsildar desk.'
    },
    {
      id: 'doc_4',
      name: 'Bonafide Certificate',
      fileName: 'college_bonafide_2026.pdf',
      size: 320000,
      userEmail: 'student@nsp.gov.in',
      uploadedAt: '2026-08-10T11:27:00.000Z',
      status: 'Verified',
      remark: 'Verified by college registrar office.'
    }
  ];
  fs.writeFileSync(docsFilePath, JSON.stringify(initialDocs, null, 2));
}

const getDocuments = () => JSON.parse(fs.readFileSync(docsFilePath, 'utf8'));
const saveDocuments = (docs) => fs.writeFileSync(docsFilePath, JSON.stringify(docs, null, 2));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// GET /api/documents
router.get('/', (req, res) => {
  const email = req.headers['x-user-email'];
  const all = getDocuments();
  if (email && req.query.filterByUser !== 'false') {
    return res.json(all.filter(d => !d.userEmail || d.userEmail.toLowerCase() === email.toLowerCase()));
  }
  res.json(all);
});

// POST /api/documents/upload
router.post('/upload', upload.single('file'), (req, res) => {
  const { documentName, userEmail } = req.body;
  const file = req.file;

  const documents = getDocuments();
  const id = `doc_${Date.now()}`;

  const newDoc = {
    id,
    name: documentName || 'Document Certificate',
    fileName: file ? file.filename : 'certificate_upload.pdf',
    originalName: file ? file.originalname : 'certificate_upload.pdf',
    size: file ? file.size : 350000,
    userEmail: userEmail || req.headers['x-user-email'] || 'student@nsp.gov.in',
    uploadedAt: new Date().toISOString(),
    status: 'Pending Verification',
    remark: 'Certificate received and queued for review.'
  };

  // Replace existing document of same type for the user if exists
  const existingIdx = documents.findIndex(
    d => d.name === newDoc.name && (!d.userEmail || d.userEmail === newDoc.userEmail)
  );
  if (existingIdx !== -1) {
    documents[existingIdx] = newDoc;
  } else {
    documents.unshift(newDoc);
  }

  saveDocuments(documents);

  res.status(201).json({
    success: true,
    document: newDoc
  });
});

// PATCH /api/documents/:id/status
router.patch('/:id/status', (req, res) => {
  const { status, remark } = req.body;
  const documents = getDocuments();
  const index = documents.findIndex(d => d.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }

  documents[index].status = status;
  if (remark) documents[index].remark = remark;
  documents[index].verifiedAt = new Date().toISOString();

  saveDocuments(documents);

  res.json({
    success: true,
    document: documents[index]
  });
});

// DELETE /api/documents/:id
router.delete('/:id', (req, res) => {
  let documents = getDocuments();
  documents = documents.filter(d => d.id !== req.params.id);
  saveDocuments(documents);
  res.json({ success: true });
});

export default router;
