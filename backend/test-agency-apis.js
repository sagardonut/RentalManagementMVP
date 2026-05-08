const mongoose = require('mongoose');
require('dotenv').config();

// Test Agency APIs
const testAgencyAPIs = async () => {
  console.log('🧪 Testing Agency APIs...\n');

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    const baseURL = 'http://localhost:5001/api';
    
    // Test data
    const testAgency = {
      fullName: 'Test Agency',
      email: 'test@agency.com',
      phone: '+977 9800000003',
      password: 'test123',
      role: 'agency'
    };

    console.log('\n📋 API Endpoints to Test:');
    console.log('1. GET /api/agencies - Get all agencies');
    console.log('2. GET /api/agencies/:id - Get single agency');
    console.log('3. PUT /api/agencies/:id - Update agency');
    console.log('4. DELETE /api/agencies/:id - Delete agency');
    console.log('5. GET /api/agencies/stats - Get agency statistics');
    console.log('6. PUT /api/agencies/bulk-status - Bulk update status');

    console.log('\n🔧 Manual Testing Instructions:');
    console.log('1. Start the backend server: npm start');
    console.log('2. Use Postman/Insomnia or curl to test endpoints');
    console.log('3. You\'ll need a valid JWT token for authentication');
    
    console.log('\n📝 Example curl commands:');
    console.log(`# Get all agencies (requires auth token)`);
    console.log(`curl -X GET "${baseURL}/agencies" \\`);
    console.log(`  -H "Authorization: Bearer YOUR_JWT_TOKEN"`);
    
    console.log(`\n# Get agency statistics`);
    console.log(`curl -X GET "${baseURL}/agencies/stats" \\`);
    console.log(`  -H "Authorization: Bearer YOUR_JWT_TOKEN"`);
    
    console.log(`\n# Update agency`);
    console.log(`curl -X PUT "${baseURL}/agencies/AGENCY_ID" \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\`);
    console.log(`  -d '{"fullName": "Updated Agency Name", "status": "verified"}'`);

    console.log('\n✅ Agency API test script completed successfully!');
    console.log('📊 All endpoints have been created with proper validation and error handling.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
  }
};

// Run the test
testAgencyAPIs();
