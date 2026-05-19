const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'agency@urban.com',
      password: 'password123',
      expectedRole: 'agency'
    });
    console.log('Success!', res.data);
  } catch (err) {
    console.error('Failed!', err.response ? err.response.data : err.message);
  }
}
test();
