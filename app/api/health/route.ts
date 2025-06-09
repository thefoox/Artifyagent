import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const checks = {
<<<<<<< HEAD
    database: { status: 'unknown', message: '' },
    shopify: { status: 'unknown', message: '' }
  }

  try {
    // Check database connection
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      checks.database = { status: 'error', message: 'Supabase configuration missing' }
    } else {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const { data, error } = await supabase.from('product').select('count').limit(1)
        
        if (error) {
          checks.database = { status: 'error', message: error.message }
        } else {
          checks.database = { status: 'ok', message: 'Database connection successful' }
        }
      } catch (dbError) {
        checks.database = { 
          status: 'error', 
          message: dbError instanceof Error ? dbError.message : 'Database connection failed' 
        }
      }
    }

    // Check Shopify configuration
    const shopifyDomain = process.env.SHOPIFY_SHOP_DOMAIN
    const shopifyToken = process.env.SHOPIFY_ACCESS_TOKEN
    
    if (!shopifyDomain || shopifyDomain === 'your-shop-name.myshopify.com') {
      checks.shopify = { status: 'warning', message: 'Shop domain not configured (demo mode will be used)' }
    } else if (!shopifyToken || shopifyToken === 'shpat_your-access-token') {
      checks.shopify = { status: 'warning', message: 'Access token not configured (demo mode will be used)' }
    } else {
      checks.shopify = { status: 'ok', message: 'Shopify credentials configured' }
    }

    // Determine overall status
    const hasErrors = Object.values(checks).some(check => check.status === 'error')
    const hasWarnings = Object.values(checks).some(check => check.status === 'warning')
    
    const overallStatus = hasErrors ? 'error' : hasWarnings ? 'warning' : 'ok'

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks
    })

  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        checks,
        error: error instanceof Error ? error.message : 'Health check failed'
      },
      { status: 500 }
    )
  }
=======
    supabase: { status: 'unknown', message: '' },
    anthropic: { status: 'unknown', message: '' },
    gelato: { status: 'unknown', message: '' }
  }

  // Check Supabase connection
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      checks.supabase = { status: 'error', message: 'Missing configuration' }
    } else {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      // Test connection by checking if we can query the log table
      const { data, error } = await supabase
        .from('log')
        .select('count')
        .limit(1)
      
      if (error) {
        checks.supabase = { status: 'error', message: error.message }
      } else {
        checks.supabase = { status: 'ok', message: 'Connected successfully' }
      }
    }
  } catch (error) {
    checks.supabase = { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' }
  }

  // Check Anthropic configuration
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY
  if (!anthropicApiKey) {
    checks.anthropic = { status: 'warning', message: 'API key not configured' }
  } else if (!anthropicApiKey.startsWith('sk-ant-')) {
    checks.anthropic = { status: 'error', message: 'Invalid API key format' }
  } else {
    checks.anthropic = { status: 'ok', message: 'API key configured' }
  }

  // Check Gelato configuration
  const gelatoApiKey = process.env.GELATO_API_KEY
  if (!gelatoApiKey) {
    checks.gelato = { status: 'warning', message: 'API key not configured (demo mode will be used)' }
  } else {
    checks.gelato = { status: 'ok', message: 'API key configured' }
  }

  const allOk = Object.values(checks).every(check => check.status === 'ok' || check.status === 'warning')

  return NextResponse.json({
    status: allOk ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks
  })
>>>>>>> dededd1 (Please p)
} 