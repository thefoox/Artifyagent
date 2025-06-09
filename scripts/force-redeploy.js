#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function forceRedeploy() {
  console.log('🔄 Force redeploying Edge Function to pick up new environment variables');
  
  const projectRef = 'kgguofkiponiuhnjcdxx';
  const accessToken = 'sbp_d148fbc73739531f4249a8a80d49e33c72a14a4e';
  
  // Read the function code
  const functionPath = path.join(__dirname, '../supabase/functions/orchestrator/index.ts');
  const functionCode = fs.readFileSync(functionPath, 'utf8');
  
  console.log('📄 Function code loaded');
  
  try {
    // First, try to delete the existing function
    console.log('🗑️ Attempting to delete existing function...');
    const deleteResponse = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/functions/orchestrator`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    
    console.log(`🗑️ Delete response: ${deleteResponse.status}`);
    
    // Wait a moment for deletion to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Now redeploy
    console.log('📡 Redeploying function...');
    const payload = {
      slug: 'orchestrator',
      name: 'orchestrator', 
      body: functionCode,
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
      console.log('✅ Function redeployed successfully!');
      console.log('🔗 Function URL: https://kgguofkiponiuhnjcdxx.supabase.co/functions/v1/orchestrator');
    } else {
      console.log('❌ Redeploy failed:', response.status, result);
    }
    
  } catch (error) {
    console.error('❌ Redeploy error:', error);
  }
}

forceRedeploy().catch(console.error); 