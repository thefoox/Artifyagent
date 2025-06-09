#!/usr/bin/env node

async function deployEnvOnly() {
  console.log('🧪 Deploying Environment Variables Only Test');
  
  const projectRef = 'kgguofkiponiuhnjcdxx';
  const accessToken = 'sbp_d148fbc73739531f4249a8a80d49e33c72a14a4e';
  
  // Environment variables only test (no imports)
  const envOnlyCode = `
Deno.serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
        }
      })
    }

    // Check environment variables
    const envCheck = {
      supabaseUrl: Deno.env.get('SUPABASE_URL') || 'NOT_SET',
      supabaseKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'SET' : 'NOT_SET',
      anthropicKey: Deno.env.get('ANTHROPIC_API_KEY') ? 'SET' : 'NOT_SET',
      gelatoKey: Deno.env.get('GELATO_API_KEY') ? 'SET' : 'NOT_SET',
      gelatoStore: Deno.env.get('GELATO_STORE_ID') || 'NOT_SET'
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Environment variables test working!',
        environmentVariables: envCheck,
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Env only test error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})
`.trim();
  
  console.log('📄 Environment-only test function prepared');
  
  try {
    // Delete existing if it exists
    await fetch(`https://api.supabase.com/v1/projects/${projectRef}/functions/env-only`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Deploy function
    console.log('📡 Deploying environment-only test function...');
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/functions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: 'env-only',
        name: 'env-only',
        body: envOnlyCode,
        verify_jwt: false
      })
    });
    
    const result = await response.text();
    
    if (response.ok) {
      console.log('✅ Environment-only test function deployed!');
      console.log('🔗 URL: https://kgguofkiponiuhnjcdxx.supabase.co/functions/v1/env-only');
      
      // Test it
      console.log('🧪 Testing environment-only function...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const testResponse = await fetch('https://kgguofkiponiuhnjcdxx.supabase.co/functions/v1/env-only', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZ3VvZmtpcG9uaXVobmpjZHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDI3MjAsImV4cCI6MjA2NDk3ODcyMH0.3ZvwP9zPPvZwvYdseK8d_1-_F6txPoK_o4bn0Xu9A-0'
        },
        body: JSON.stringify({ test: true })
      });
      
      console.log(`📊 Status: ${testResponse.status}`);
      
      if (testResponse.ok) {
        const result = await testResponse.json();
        console.log('✅ Environment-Only Test SUCCESS!');
        console.log('📄 Environment Variables:', JSON.stringify(result.environmentVariables, null, 2));
        
        if (result.environmentVariables.anthropicKey === 'SET' && 
            result.environmentVariables.gelatoKey === 'SET') {
          console.log('🎉 All required environment variables are properly set!');
        } else {
          console.log('⚠️ Some environment variables may be missing');
        }
        
      } else {
        const errorText = await testResponse.text();
        console.log('❌ Environment-only test failed:', errorText);
      }
      
    } else {
      console.log('❌ Deploy failed:', response.status, result);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

deployEnvOnly().catch(console.error); 