// National Scholarship Data Store & Inspection Module
import { SCHOLARSHIPS, CATEGORIES, STATES, COURSES, COMMUNITIES } from './frontend/src/data/scholarships.js';

export * from './frontend/src/data/scholarships.js';

// If executed directly with Node (e.g., node store.js)
const isMain = process.argv[1] && (process.argv[1].endsWith('store.js') || process.argv[1].includes('store.js'));

if (isMain) {
  console.log('====================================================================');
  console.log(' 🏛️  National Scholarship Portal - Data Store Inspection');
  console.log('====================================================================');
  console.log(` • Total Scholarships:  ${SCHOLARSHIPS.length} active schemes`);
  console.log(` • Categories (${CATEGORIES.length}):     ${CATEGORIES.slice(0, 5).join(', ')}...`);
  console.log(` • States (${STATES.length}):         ${STATES.slice(0, 5).join(', ')}...`);
  console.log(` • Courses (${COURSES.length}):        ${COURSES.join(', ')}`);
  console.log(` • Communities (${COMMUNITIES.length}):    ${COMMUNITIES.join(', ')}`);
  console.log('--------------------------------------------------------------------');
  console.log(' Sample Schemes Loaded:');
  SCHOLARSHIPS.slice(0, 5).forEach((s, idx) => {
    console.log(`   ${idx + 1}. [${s.code}] ${s.name} - ₹${s.amount.toLocaleString('en-IN')} (${s.category})`);
  });
  console.log('--------------------------------------------------------------------');
  console.log(' 🚀 Web App Access:');
  console.log('    • Frontend Portal:  http://localhost:3000');
  console.log('    • Backend API:      http://localhost:5000');
  console.log('====================================================================');
}
