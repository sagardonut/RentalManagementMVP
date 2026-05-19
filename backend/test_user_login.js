const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'member@urban.com',
      password: 'password123',
      expectedRole: 'user'
    });
    console.log('Success!', res.data);
  } catch (err) {
    console.error('Failed!', err.response ? err.response.data : err.message);
  }
}
test();
