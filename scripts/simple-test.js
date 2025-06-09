const https = require('http');

async function testDeveloperAI() {
  console.log('🤖 Testing Developer AI Agent...\n');

  try {
    // Test GET endpoint
    console.log('📋 Getting service information...');
    const getResponse = await fetch('http://localhost:3000/api/developer-ai');
    const info = await getResponse.json();
    console.log('✅ Service Info:', JSON.stringify(info, null, 2));

    // Test POST endpoint
    console.log('\n💬 Testing basic query...');
    const postResponse = await fetch('http://localhost:3000/api/developer-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Analyze the current system architecture and identify potential bottlenecks'
      })
    });

    const result = await postResponse.json();
    console.log('✅ Response:', JSON.stringify(result, null, 2));

    if (result.success && result.response) {
      console.log('\n📊 AI Analysis:');
      result.response.forEach((item, index) => {
        console.log(`${index + 1}. ${item.text || JSON.stringify(item)}`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDeveloperAI(); 