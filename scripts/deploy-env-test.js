#!/usr/bin/env node

async function deployEnvTest() {
  console.log('🧪 Deploying Environment Test Function');
  
  const projectRef = 'kgguofkiponiuhnjcdxx';
  const accessToken = 'sbp_d148fbc73739531f4249a8a80d49e33c72a14a4e';
  
  // Environment test function that uses Supabase and checks env vars
  const envTestCode = `
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
      supabaseUrl: !!Deno.env.get('SUPABASE_URL'),
      supabaseKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      anthropicKey: !!Deno.env.get('ANTHROPIC_API_KEY'),
      gelatoKey: !!Deno.env.get('GELATO_API_KEY'),
      gelatoStore: !!Deno.env.get('GELATO_STORE_ID')
    }

    // Test Supabase connection
    let supabaseTest = { connected: false, error: null }
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      // Simple query to test connection
      const { data, error } = await supabase.from('log').select('count').limit(1)
      supabaseTest = { connected: !error, error: error?.message || null }
    } catch (err) {
      supabaseTest = { connected: false, error: err.message }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Environment test function working!',
        environmentVariables: envCheck,
        supabaseConnection: supabaseTest,
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
    console.error('Env test error:', error)
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
  
  console.log('📄 Environment test function prepared');
  
  try {
    // Delete existing if it exists
    await fetch(`https://api.supabase.com/v1/projects/${projectRef}/functions/env-test`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Deploy function
    console.log('📡 Deploying environment test function...');
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/functions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: 'env-test',
        name: 'env-test',
        body: envTestCode,
        verify_jwt: false
      })
    });
    
    const result = await response.text();
    
    if (response.ok) {
      console.log('✅ Environment test function deployed!');
      console.log('🔗 URL: https://kgguofkiponiuhnjcdxx.supabase.co/functions/v1/env-test');
      
      // Test it
      console.log('🧪 Testing environment function...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const testResponse = await fetch('https://kgguofkiponiuhnjcdxx.supabase.co/functions/v1/env-test', {
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
        console.log('✅ Environment Test SUCCESS!');
        console.log('📄 Environment Variables:', JSON.stringify(result.environmentVariables, null, 2));
        console.log('📄 Supabase Connection:', JSON.stringify(result.supabaseConnection, null, 2));
      } else {
        const errorText = await testResponse.text();
        console.log('❌ Environment test failed:', errorText);
      }
      
    } else {
      console.log('❌ Deploy failed:', response.status, result);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

deployEnvTest().catch(console.error); 