#!/usr/bin/env npx tsx

import { validateSupabaseConnection } from '../lib/supabase'

async function healthCheck() {
  console.log('🎨 Artify Agent Health Check')
  console.log('============================')
  
  // Check environment variables
  console.log('\n📋 Environment Variables:')
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'ANTHROPIC_API_KEY',
    'GELATO_API_KEY',
    'SUPABASE_JWT_SECRET',
    'SUPABASE_ACCESS_TOKEN'
  ]
  
  let envVarCount = 0
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar]
    if (value) {
      console.log(`✅ ${envVar}: ${value.substring(0, 20)}...`)
      envVarCount++
    } else {
      console.log(`❌ ${envVar}: Missing`)
    }
  }
  
  console.log(`\n📊 Environment Score: ${envVarCount}/${requiredEnvVars.length}`)
  
  // Test Supabase connection
  console.log('\n🗄️  Supabase Connection:')
  try {
    const isConnected = await validateSupabaseConnection()
    if (isConnected) {
      console.log('✅ Supabase connection successful')
    } else {
      console.log('❌ Supabase connection failed')
    }
  } catch (error) {
    console.log(`❌ Supabase connection error: ${error}`)
  }
  
  // Test Gelato API key format
  console.log('\n🍨 Gelato Configuration:')
  const gelatoKey = process.env.GELATO_API_KEY
  if (gelatoKey && gelatoKey.includes(':')) {
    console.log('✅ Gelato API key format appears valid')
  } else {
    console.log('❌ Gelato API key format invalid (should contain ":")')
  }
  
  // Test Claude API key format
  console.log('\n🤖 Claude AI Configuration:')
  const claudeKey = process.env.ANTHROPIC_API_KEY
  if (claudeKey && claudeKey.startsWith('sk-ant-')) {
    console.log('✅ Claude API key format appears valid')
  } else {
    console.log('❌ Claude API key format invalid (should start with "sk-ant-")')
  }
  
  console.log('\n🎯 Demo Mode:')
  const demoMode = process.env.DEMO_MODE
  console.log(`📍 Demo Mode: ${demoMode === 'true' ? 'Enabled' : 'Disabled'}`)
  
  console.log('\n✨ Health Check Complete!')
  console.log('\nNext steps:')
  console.log('1. Run "npm run dev" to start the development server')
  console.log('2. Visit http://localhost:3000 to test the upload interface')
  console.log('3. Upload an image and watch the AI-powered automation!')
}

// Run health check
healthCheck().catch(console.error) 