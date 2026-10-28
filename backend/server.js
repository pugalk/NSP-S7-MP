import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import scholarshipsRouter from './routes/scholarships.js';
import eligibilityRouter from './routes/eligibility.js';
import authRouter from './routes/auth.js';
import applicationsRouter from './routes/applications.js';
import documentsRouter from './routes/documents.js';
import adminRouter from './routes/admin.js';
import aiRouter from './routes/ai.js';
import organizerRouter from './routes/organizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'National Scholarship Portal API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Meta constants
app.get('/api/meta/constants', (req, res) => {
  const constantsPath = path.join(__dirname, 'data/constants.json');
  if (fs.existsSync(constantsPath)) {
    const constants = JSON.parse(fs.readFileSync(constantsPath, 'utf8'));
    return res.json(constants);
  }
  res.json({});
});

// API Routes
app.use('/api/scholarships', scholarshipsRouter);
app.use('/api/eligibility', eligibilityRouter);
app.use('/api/auth', authRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai', aiRouter);
app.use('/api/organizer', organizerRouter);

// Serve frontend build in production
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` National Scholarship Portal API Server`);
  console.log(` Running on: http://localhost:${PORT}`);
  console.log(` Active Schemes: 82 Loaded`);
  console.log(` Endpoints:`);
  console.log(`   - GET  /api/scholarships`);
  console.log(`   - POST /api/eligibility/check`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/applications`);
  console.log(`   - GET  /api/admin/stats`);
  console.log(`====================================================`);
});
