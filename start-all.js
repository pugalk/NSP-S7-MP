import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================================');
console.log(' Starting National Scholarship Renewal & Eligibility Portal (Full Stack)');
console.log(' Backend API:  http://localhost:5000');
console.log(' Frontend App: http://localhost:3000');
console.log('====================================================================');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const nodeCmd = 'node';

// Spawn Backend
const backend = spawn(nodeCmd, ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: false
});

backend.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line.trim()) console.log(`\x1b[36m[BACKEND]\x1b[0m ${line}`);
  });
});

backend.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line.trim()) console.error(`\x1b[31m[BACKEND ERR]\x1b[0m ${line}`);
  });
});

// Spawn Frontend
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: isWindows
});

frontend.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line.trim()) console.log(`\x1b[35m[FRONTEND]\x1b[0m ${line}`);
  });
});

frontend.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line.trim()) console.error(`\x1b[33m[FRONTEND ERR]\x1b[0m ${line}`);
  });
});

const cleanup = () => {
  console.log('\nShutting down dev servers cleanly...');
  if (isWindows) {
    try {
      if (backend && backend.pid) execSync(`taskkill /pid ${backend.pid} /T /F`, { stdio: 'ignore' });
    } catch (e) {}
    try {
      if (frontend && frontend.pid) execSync(`taskkill /pid ${frontend.pid} /T /F`, { stdio: 'ignore' });
    } catch (e) {}
  } else {
    try { backend.kill(); } catch (e) {}
    try { frontend.kill(); } catch (e) {}
  }
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
