import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDir = path.join(__dirname, '../frontend');

console.log('[BUILD] Preparing backend and assets...');

if (fs.existsSync(frontendDir) && fs.existsSync(path.join(frontendDir, 'package.json'))) {
  try {
    console.log('[BUILD] Building frontend distribution...');
    execSync('npm --prefix ../frontend install --no-audit --no-fund', { stdio: 'inherit' });
    execSync('npm --prefix ../frontend run build', { stdio: 'inherit' });
    console.log('[BUILD] Frontend built successfully.');
  } catch (err) {
    console.warn('[BUILD] Frontend build notice:', err.message);
  }
} else {
  console.log('[BUILD] Frontend not found or already compiled. Backend is ready.');
}
