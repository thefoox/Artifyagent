import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

<<<<<<< HEAD
    // Include comprehensive Shopify admin documentation and current system context
    const systemContext = {
      project: "Artify Agent - AI-powered print automation system",
      current_architecture: {
        platform: "Next.js 14 with Supabase backend",
        shopify_integration: "Custom app with REST API",
        shop_domain: "grabbitposters.myshopify.com",
        product_variants: "18 variants (3 sizes × 3 materials × 2 frame options)",
        pricing_range: "€19.99 - €99.99",
        current_permissions: ["read_products", "write_products", "read_inventory", "write_inventory"]
      },
      shopify_admin_permissions: {
        required_base_permissions: ["Manage and install apps and channels", "Develop apps"],
        product_management: "View or manage products, variants, and collections",
        current_scopes: ["read_products", "write_products"],
        available_scopes: [
          "read_analytics", "read_customers", "write_customers",
          "read_discounts", "write_discounts", "read_orders", "write_orders",
          "read_inventory", "write_inventory", "read_fulfillments", "write_fulfillments",
          "read_shipping", "write_shipping", "read_content", "write_content"
        ]
      },
      documentation_urls: [
        "https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/generate-app-access-tokens-admin",
        "https://shopify.dev/docs/api/admin-rest",
        "https://shopify.dev/docs/api/admin-rest/2023-10/resources/product",
        "https://shopify.dev/docs/apps/build",
        "https://docs.anthropic.com/claude/docs"
      ]
    }

    const userContent = context 
      ? `${message}\n\nAdditional context: ${context}\n\nSystem Context: ${JSON.stringify(systemContext, null, 2)}`
      : `${message}\n\nSystem Context: ${JSON.stringify(systemContext, null, 2)}`
=======
    // Include relevant project documentation URLs
    const documentationUrls = [
      "https://dashboard.gelato.com/docs/",
      "https://supabase.com/docs",
      "https://connect-api.live.gelato.tech/docs/",
      "https://docs.anthropic.com/en/home"
    ]

    const userContent = context 
      ? `${message}\n\nAdditional context: ${context}\n\nRelevant documentation: ${documentationUrls.join('\n')}`
      : `${message}\n\nRelevant documentation: ${documentationUrls.join('\n')}`
>>>>>>> dededd1 (Please p)

    const response = await client.beta.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 20000,
<<<<<<< HEAD
      temperature: 0.7,
      system: `You are an Admin Developer AI for the Artify Agent system - an AI-powered print automation platform that creates Shopify products.

CURRENT SYSTEM STATUS:
- Platform: Next.js 14 with Supabase backend and Anthropic AI
- Shopify Store: grabbitposters.myshopify.com (Postershopgrabbit)
- Integration: Shopify REST API with custom app authentication
- Product Structure: 18 variants per upload (A4/A3/50x70cm × Standard/Premium/Canvas × None/With Frame)
- Pricing: €19.99-€99.99 range
- Status: Production ready, successfully creating products

ADMIN CAPABILITIES & PERMISSIONS:
You have administrative access to manage:
- Shopify API scopes and permissions
- Product creation and variant management  
- Database schema and migrations
- System integrations and API optimizations
- Error troubleshooting and performance tuning

SHOPIFY ADMIN PERMISSIONS CONTEXT:
- Current scopes: read_products, write_products, read_inventory, write_inventory
- Required base permissions: "Manage and install apps and channels" + "Develop apps"
- Available for expansion: analytics, customers, orders, fulfillments, shipping, content
- Access token management: Admin-created custom app (cannot rotate, must recreate)

YOUR ROLE:
1. System Architecture: Optimize API integrations and data flow
2. Permission Management: Advise on Shopify scope requirements and admin permissions
3. Error Resolution: Debug and fix integration issues
4. Performance Optimization: Improve system efficiency and reliability
5. Feature Development: Suggest and implement new capabilities
6. Security: Ensure proper authentication and authorization

CURRENT TECHNICAL STACK:
- Frontend: Next.js 14 with TypeScript
- Backend: Supabase (PostgreSQL)
- AI: Anthropic Claude for metadata generation
- E-commerce: Shopify REST API integration
- Authentication: Shopify custom app access tokens

Always provide specific, actionable solutions with code examples when relevant. Consider both immediate fixes and long-term architectural improvements.`,
=======
      temperature: 1,
      system: `You job is to optimize the API and get all system to talk to eachother. Get an overview and understanding over the state of the project. 

You are a developer agent AI working with integration, API, userflow and optimization. Your main task is to make sure that everything workds perfectly. You are to be given urls with the documentation for each API service and integration we are using.`,
>>>>>>> dededd1 (Please p)
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": userContent
            }
          ]
        }
      ],
      tools: [
        {
          "name": "web_search",
          "type": "web_search_20250305"
        }
      ],
      betas: ["web-search-2025-03-05"]
    })

    return NextResponse.json({
      success: true,
      response: response.content,
      model: "claude-sonnet-4-20250514",
<<<<<<< HEAD
      usage: response.usage,
      admin_context: systemContext
    })

  } catch (error) {
    console.error('Admin Developer AI API error:', error)
=======
      usage: response.usage
    })

  } catch (error) {
    console.error('Developer AI API error:', error)
>>>>>>> dededd1 (Please p)
    
    // Handle specific Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message, 
          type: 'anthropic_api_error',
          status: error.status 
        },
        { status: error.status || 500 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

<<<<<<< HEAD
// GET endpoint for admin info and capabilities
export async function GET() {
  const adminCapabilities = {
    service: 'Admin Developer AI Agent',
    model: 'claude-sonnet-4-20250514',
    system_status: {
      platform: 'Artify Agent - Next.js 14',
      shopify_store: 'grabbitposters.myshopify.com',
      integration_status: 'Active',
      product_variants: 18,
      current_mode: 'Production'
    },
    admin_capabilities: [
      'Shopify API scope management',
      'Product and variant optimization', 
      'Database schema management',
      'System integration analysis',
      'Error diagnosis and resolution',
      'Performance monitoring',
      'Security audit and recommendations',
      'Feature development planning'
    ],
    shopify_permissions: {
      current_scopes: ['read_products', 'write_products', 'read_inventory', 'write_inventory'],
      admin_requirements: ['Manage and install apps and channels', 'Develop apps'],
      expandable_scopes: [
        'read_analytics - View store metrics',
        'read_customers/write_customers - Customer management', 
        'read_orders/write_orders - Order management',
        'read_fulfillments/write_fulfillments - Fulfillment services',
        'read_shipping/write_shipping - Shipping management',
        'read_discounts/write_discounts - Discount management'
      ]
    },
    documentation: [
      "https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/generate-app-access-tokens-admin",
      "https://shopify.dev/docs/api/admin-rest",
      "https://shopify.dev/docs/api/admin-rest/2023-10/resources/product",
      "https://shopify.dev/docs/apps/build",
      "https://docs.anthropic.com/claude/docs"
    ]
  }

  return NextResponse.json(adminCapabilities)
=======
// GET endpoint for health check and info
export async function GET() {
  return NextResponse.json({
    service: 'Developer AI Agent',
    model: 'claude-sonnet-4-20250514',
    capabilities: [
      'API optimization',
      'System integration analysis', 
      'Web search',
      'Documentation analysis'
    ],
    documentation: [
      "https://dashboard.gelato.com/docs/",
      "https://supabase.com/docs",
      "https://connect-api.live.gelato.tech/docs/", 
      "https://docs.anthropic.com/en/home"
    ]
  })
>>>>>>> dededd1 (Please p)
} 