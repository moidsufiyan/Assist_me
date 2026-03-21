const mongoose = require('mongoose');
const UserProfile = require('./models/UserProfile');

async function testCRUD() {
  // Connect to DB directly for testing using fetch might require running server
  // Instead we'll simulate testing via fetch against running server
  try {
    console.log('1. Trying to GET profile (should be 404 or empty)');
    let res = await fetch('http://localhost:5000/api/profile');
    console.log('GET Status:', res.status);
    let data = await res.json();
    console.log('GET Data:', data);

    console.log('\n2. Trying to POST (create) new profile');
    const newProfile = {
      personal: { name: 'Test User', email: 'test@example.com', phone: '1234567890', location: 'Earth' },
      skills: ['React', 'Node.js'],
      achievements: ['Built a MERN app']
    };
    
    res = await fetch('http://localhost:5000/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfile)
    });
    console.log('POST Status:', res.status);
    data = await res.json();
    console.log('POST Data:', data);

    console.log('\n3. Trying to POST (update) existing profile');
    const updateProfile = {
      ...newProfile,
      skills: ['React', 'Node.js', 'MongoDB', 'Express']
    };
    
    res = await fetch('http://localhost:5000/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateProfile)
    });
    console.log('POST Update Status:', res.status);
    data = await res.json();
    console.log('POST Update Data (skills count):', data.skills.length);
    
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testCRUD();
