async function testChat() {
  console.log('Testing POST /api/chat with user query...');
  try {
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userQuery: 'What are my listed skills?' })
    });
    
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response body:', data);
  } catch (err) {
    console.error('Test error:', err);
  }
}

testChat();
