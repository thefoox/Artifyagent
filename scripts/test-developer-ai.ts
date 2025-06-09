#!/usr/bin/env npx tsx

import { DeveloperAI, DeveloperAITasks } from '../lib/developer-ai'

// Initialize the developer AI client
const ai = new DeveloperAI('http://localhost:3000/api/developer-ai')

async function testDeveloperAI() {
  console.log('🤖 Testing Developer AI Agent...\n')

  try {
    // Test 1: Get service info
    console.log('📋 Getting service information...')
    const info = await ai.getInfo()
    console.log('Service Info:', JSON.stringify(info, null, 2), '\n')

    // Test 2: Basic query
    console.log('💬 Basic query test...')
    const basicResponse = await ai.query(
      "Analyze the current system architecture and identify potential bottlenecks."
    )
    console.log('Response:', basicResponse.response?.[0], '\n')

    // Test 3: Integration analysis
    console.log('🔗 Testing integration analysis...')
    const integrationResponse = await ai.analyzeIntegration(
      ['Supabase', 'Gelato', 'Anthropic'],
      'Occasional timeout issues during product creation'
    )
    console.log('Integration Analysis:', integrationResponse.response?.[0], '\n')

    // Test 4: System optimization
    console.log('⚡ Testing system optimization...')
    const optimizationResponse = await ai.optimizeSystem({
      averageResponseTime: '2.5s',
      errorRate: '0.02%',
      throughput: '100 requests/minute'
    })
    console.log('Optimization Suggestions:', optimizationResponse.response?.[0], '\n')

    // Test 5: User flow review
    console.log('👤 Testing user flow review...')
    const userFlowResponse = await ai.reviewUserFlow(
      "User uploads image -> AI generates metadata -> Creates product variants -> Sends to Gelato -> Product becomes available"
    )
    console.log('User Flow Analysis:', userFlowResponse.response?.[0], '\n')

    // Test 6: API debugging
    console.log('🐛 Testing API debugging...')
    const debugResponse = await ai.debugAPIIssue(
      'Gelato API',
      'Receiving 429 rate limit errors during peak hours'
    )
    console.log('Debug Analysis:', debugResponse.response?.[0], '\n')

    // Test 7: Predefined tasks
    console.log('🔧 Testing predefined tasks...')
    
    console.log('Running health check...')
    const healthCheck = await DeveloperAITasks.healthCheck()
    console.log('Health Check:', healthCheck.response?.[0], '\n')

    console.log('Getting recommendations...')
    const recommendations = await DeveloperAITasks.getRecommendations()
    console.log('Recommendations:', recommendations.response?.[0], '\n')

    console.log('✅ All tests completed successfully!')

  } catch (error) {
    console.error('❌ Test failed:', error)
    
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
  }
}

// Example of how to use in application code
async function applicationExample() {
  console.log('\n📱 Application Integration Example...\n')

  try {
    // Example: Monitoring system health
    const healthResult = await DeveloperAITasks.healthCheck()
    if (healthResult.success) {
      console.log('✅ System health check passed')
    }

    // Example: Analyzing API performance issues
    const apiIssue = await ai.debugAPIIssue(
      'Supabase',
      'Slow response times on product queries'
    )
    console.log('API Issue Analysis:', apiIssue.response?.[0])

    // Example: Getting optimization recommendations
    const optimize = await ai.optimizeSystem({
      database_queries_per_minute: 500,
      api_calls_per_minute: 200,
      average_processing_time: '3.2s'
    })
    console.log('Optimization Recommendations:', optimize.response?.[0])

  } catch (error) {
    console.error('Application example failed:', error)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testDeveloperAI()
    .then(() => applicationExample())
    .then(() => {
      console.log('\n🎉 Developer AI integration ready!')
      console.log('\nTo use in your application:')
      console.log('```typescript')
      console.log('import { developerAI, DeveloperAITasks } from "./lib/developer-ai"')
      console.log('')
      console.log('// Quick health check')
      console.log('const health = await DeveloperAITasks.healthCheck()')
      console.log('')
      console.log('// Custom query')
      console.log('const analysis = await developerAI.query("Analyze API performance")')
      console.log('```')
    })
    .catch(console.error)
} 