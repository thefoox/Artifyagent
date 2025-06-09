#!/usr/bin/env node

async function testEdgeFunction() {
  console.log('🧪 Testing Edge Function Connectivity');
  console.log('====================================');

  const functionUrl = 'https://kgguofkiponiuhnjcdxx.supabase.co/functions/v1/orchestrator';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZ3VvZmtpcG9uaXVobmpjZHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDI3MjAsImV4cCI6MjA2NDk3ODcyMH0.3ZvwP9zPPvZwvYdseK8d_1-_F6txPoK_o4bn0Xu9A-0';
  
  const testPayload = {
    file: {
      publicUrl: 'https://cdn.example.com/test-image.jpg',
      filename: 'test-image.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1024000
    },
    demoMode: true
  };
  
  try {
    console.log('📡 Making test request...');
    console.log(`🔗 URL: ${functionUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify(testPayload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log(`📊 Response Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Function is accessible!');
      console.log('📄 Response:', JSON.stringify(result, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Function returned error:', response.status);
      console.log('📄 Error:', errorText);
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('⏰ Request timed out after 10 seconds');
    } else if (error.cause?.code === 'ENOTFOUND') {
      console.log('❌ DNS resolution failed:', error.cause.hostname);
    } else {
      console.log('❌ Request failed:', error.message);
    }
  }
}

testEdgeFunction().catch(console.error); 