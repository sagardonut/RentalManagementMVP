const fs = require('fs');
const parser = require('@babel/parser');
try {
  const code = fs.readFileSync('src/pages/AgencyDashboard.jsx', 'utf8');
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log("No parsing errors.");
} catch (e) {
  console.error(e.message);
}
