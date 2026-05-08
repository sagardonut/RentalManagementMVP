import fs from 'fs';
import path from 'path';

const pages = [
  'Rooms.jsx',
  'RoomDetails.jsx',
  'BookingPayment.jsx',
  'BookingSuccess.jsx',
  'PaymentSetup.jsx',
  'UserDashboard.jsx',
  'AgentDashboard.jsx',
  'AgencyDashboard.jsx',
  'SuperAdminDashboard.jsx',
];

const template = (name) => `
import React from 'react';

export default function ${name.replace('.jsx', '')}() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-4">${name.replace('.jsx', '')}</h1>
        <p className="text-slate-500">This is a placeholder for the ${name.replace('.jsx', '')} page.</p>
        <a href="/" className="mt-6 inline-block bg-primary text-on-primary px-6 py-2 rounded-lg font-bold">Go Home</a>
      </div>
    </div>
  );
}
`;

const dir = path.join(process.cwd(), 'src', 'pages');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

pages.forEach(page => {
  fs.writeFileSync(path.join(dir, page), template(page));
});

console.log('Pages created successfully.');
