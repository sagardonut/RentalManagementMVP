// Simple test to check SuperAdminDashboard rendering
import React from 'react';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

console.log('Testing SuperAdminDashboard component...');

try {
  const TestComponent = () => {
    console.log('Rendering TestComponent');
    return (
      <div>
        <h1>Test Page - SuperAdmin Dashboard</h1>
        <p>If you can see this, the basic React setup is working.</p>
        <SuperAdminDashboard />
      </div>
    );
  };
  console.log('TestComponent created successfully');
  export default TestComponent;
} catch (error) {
  console.error('Error creating test component:', error);
}
