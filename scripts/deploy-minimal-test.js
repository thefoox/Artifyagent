#!/usr/bin/env node

async function deployMinimalTest() {
  console.log('🧪 Deploying Ultra-Minimal Test Function');
  
  const projectRef = 'kgguofkiponiuhnjcdxx';
  const accessToken = 'sbp_d148fbc73739531f4249a8a80d49e33c72a14a4e';
  
  // Create ultra-minimal test function
  const minimalCode = `
Deno.serve(() => {
  return new Response(JSON.stringify({
    success: true,
    message: 'Minimal function working!',
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
`.trim();
  
  console.log('📄 Minimal function code prepared');
  
  try {
    // Delete existing if it exists
    await fetch(`https://api.supabase.com/v1/projects/${projectRef}/functions/minimal-test`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Deploy minimal function
    console.log('📡 Deploying minimal function...');
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/functions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: 'minimal-test',
        name: 'minimal-test',
        body: minimalCode,
        verify_jwt: false
      })
    });
    
    const result = await response.text();
    
    if (response.ok) {
      console.log('✅ Minimal function deployed!');
      console.log('🔗 URL: https://kgguofkiponiuhnjcdxx.supabase.co/functions/v1/minimal-test');
      
      // Test it
      console.log('🧪 Testing...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const testResponse = await fetch('https://kgguofkiponiuhnjcdxx.supabase.co/functions/v1/minimal-test');
      console.log(`📊 Status: ${testResponse.status}`);
      
      if (testResponse.ok) {
        const result = await testResponse.json();
        console.log('✅ SUCCESS!', result);
      } else {
        const errorText = await testResponse.text();
        console.log('❌ Error:', errorText);
      }
      
    } else {
      console.log('❌ Deploy failed:', response.status, result);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

deployMinimalTest().catch(console.error); 