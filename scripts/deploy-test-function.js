#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function deployTestFunction() {
  console.log('🧪 Deploying Test Edge Function');
  
  const projectRef = 'kgguofkiponiuhnjcdxx';
  const accessToken = 'sbp_d148fbc73739531f4249a8a80d49e33c72a14a4e';
  
  // Create minimal test function
  const testFunctionCode = `
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
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

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test function is working!',
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
    console.error('Test function error:', error)
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
  
  console.log('📄 Test function code prepared');
  
  try {
    // Delete existing test function if it exists
    console.log('🗑️ Cleaning up existing test function...');
    await fetch(`https://api.supabase.com/v1/projects/${projectRef}/functions/test-orchestrator`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Deploy test function
    console.log('📡 Deploying test function...');
    const payload = {
      slug: 'test-orchestrator',
      name: 'test-orchestrator', 
      body: testFunctionCode,
      verify_jwt: false
    };
    
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/functions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.text();
    
    if (response.ok) {
      console.log('✅ Test function deployed successfully!');
      console.log('🔗 Test URL: https://kgguofkiponiuhnjcdxx.supabase.co/functions/v1/test-orchestrator');
      
      // Test it immediately
      console.log('🧪 Testing the function...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for function to be ready
      
      const testResponse = await fetch('https://kgguofkiponiuhnjcdxx.supabase.co/functions/v1/test-orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZ3VvZmtpcG9uaXVobmpjZHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDI3MjAsImV4cCI6MjA2NDk3ODcyMH0.3ZvwP9zPPvZwvYdseK8d_1-_F6txPoK_o4bn0Xu9A-0'
        },
        body: JSON.stringify({ test: true })
      });
      
      console.log(`📊 Test Response Status: ${testResponse.status}`);
      
      if (testResponse.ok) {
        const testResult = await testResponse.json();
        console.log('✅ Test function is working!');
        console.log('📄 Environment Variables Check:', JSON.stringify(testResult.environmentVariables, null, 2));
      } else {
        const errorText = await testResponse.text();
        console.log('❌ Test function failed:', testResponse.status, errorText);
      }
      
    } else {
      console.log('❌ Test function deployment failed:', response.status, result);
    }
    
  } catch (error) {
    console.error('❌ Deployment error:', error);
  }
}

deployTestFunction().catch(console.error); 