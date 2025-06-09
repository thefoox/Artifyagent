#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function deployFunction() {
  console.log('🚀 Deploying Orchestrator Edge Function');
  
  const projectRef = process.env.SUPABASE_PROJECT_REF || 'your-project-ref';
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error('❌ SUPABASE_ACCESS_TOKEN not found in environment variables');
    process.exit(1);
  }
  
  // Read the function code
  const functionPath = path.join(__dirname, '../supabase/functions/orchestrator/index.ts');
  const functionCode = fs.readFileSync(functionPath, 'utf8');
  
  console.log('📄 Function code loaded');
  
  // Prepare the deployment payload
  const payload = {
    slug: 'orchestrator',
    name: 'orchestrator', 
    body: functionCode,
    verify_jwt: false
  };
  
  try {
    console.log('📡 Deploying to Supabase...');
    
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
      console.log('✅ Function deployed successfully!');
      console.log(`🔗 Function URL: https://${process.env.SUPABASE_HOSTNAME || 'your-hostname'}.supabase.co/functions/v1/orchestrator`);
    } else {
      console.log('❌ Deployment failed:', response.status, result);
    }
    
  } catch (error) {
    console.error('❌ Deployment error:', error);
  }
}

// Also set environment variables for the function
async function setEnvironmentVariables() {
  console.log('🔧 Setting environment variables...');
  
  const projectRef = process.env.SUPABASE_PROJECT_REF || 'your-project-ref';
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error('❌ SUPABASE_ACCESS_TOKEN not found in environment variables');
    return;
  }
  
  const envVars = [
    { name: 'SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', value: process.env.SUPABASE_SERVICE_ROLE_KEY },
    { name: 'ANTHROPIC_API_KEY', value: process.env.ANTHROPIC_API_KEY },
    { name: 'SHOPIFY_SHOP_DOMAIN', value: process.env.SHOPIFY_SHOP_DOMAIN },
    { name: 'SHOPIFY_ACCESS_TOKEN', value: process.env.SHOPIFY_ACCESS_TOKEN }
  ].filter(envVar => envVar.value); // Only include vars that exist
  
  for (const envVar of envVars) {
    try {
      const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/secrets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([envVar])
      });
      
      if (response.ok) {
        console.log(`✅ Set ${envVar.name}`);
      } else {
        console.log(`❌ Failed to set ${envVar.name}:`, response.status);
      }
    } catch (error) {
      console.log(`❌ Error setting ${envVar.name}:`, error.message);
    }
  }
}

// Run deployment
async function main() {
  console.log('📋 Note: This script now reads from environment variables for security');
  console.log('📋 Make sure your .env file contains all required keys');
  
  await setEnvironmentVariables();
  await deployFunction();
  
  console.log('\n✨ Deployment complete!');
  console.log('🔗 Your function is available at:');
  console.log(`https://${process.env.SUPABASE_HOSTNAME || 'your-hostname'}.supabase.co/functions/v1/orchestrator`);
}

main().catch(console.error); 
