import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

// Types
interface FileUpload {
  publicUrl: string
  filename?: string
  contentType?: string
  sizeBytes?: number
}

<<<<<<< HEAD
interface ShopifyVariant {
  material: string
  size: string
  frame: string
  price: number
  sku: string
=======
interface GelatoVariant {
  templateVariantId: string
  material: string
  size: string
  frame: string
>>>>>>> dededd1 (Please p)
}

interface ProductCreationRequest {
  file: FileUpload
  userId?: string
  demoMode?: boolean
}

<<<<<<< HEAD
// Demo mode configuration - simplified variants for testing
const DEMO_VARIANTS: ShopifyVariant[] = [
  {
    material: "Premium Paper",
    size: "A4",
    frame: "None",
    price: 29.99,
    sku: "PRINT-A4-PREMIUM"
  },
  {
    material: "Premium Paper",
    size: "A3",
    frame: "None",
    price: 39.99,
    sku: "PRINT-A3-PREMIUM"
  }
]

// Production variants - Simple 3 sizes × 3 papers × 2 frame options = 18 variants
const PRODUCTION_VARIANTS: ShopifyVariant[] = [
  // A4 - All paper types and frame options
  {
    material: "Standard Paper",
    size: "A4",
    frame: "None",
    price: 19.99,
    sku: "A4-STANDARD-NOFRAME"
  },
  {
    material: "Standard Paper",
    size: "A4", 
    frame: "With Frame",
    price: 49.99,
    sku: "A4-STANDARD-FRAME"
  },
  {
    material: "Premium Paper",
    size: "A4",
    frame: "None",
    price: 24.99,
    sku: "A4-PREMIUM-NOFRAME"
  },
  {
    material: "Premium Paper",
    size: "A4",
    frame: "With Frame",
    price: 54.99,
    sku: "A4-PREMIUM-FRAME"
  },
  {
    material: "Canvas",
    size: "A4",
    frame: "None",
    price: 29.99,
    sku: "A4-CANVAS-NOFRAME"
  },
  {
    material: "Canvas",
    size: "A4",
    frame: "With Frame",
    price: 59.99,
    sku: "A4-CANVAS-FRAME"
  },

  // A3 - All paper types and frame options
  {
    material: "Standard Paper",
    size: "A3",
    frame: "None",
    price: 29.99,
    sku: "A3-STANDARD-NOFRAME"
  },
  {
    material: "Standard Paper",
    size: "A3",
    frame: "With Frame", 
    price: 69.99,
    sku: "A3-STANDARD-FRAME"
  },
  {
    material: "Premium Paper",
    size: "A3",
    frame: "None",
    price: 34.99,
    sku: "A3-PREMIUM-NOFRAME"
  },
  {
    material: "Premium Paper",
    size: "A3",
    frame: "With Frame",
    price: 74.99,
    sku: "A3-PREMIUM-FRAME"
  },
  {
    material: "Canvas",
    size: "A3",
    frame: "None",
    price: 39.99,
    sku: "A3-CANVAS-NOFRAME"
  },
  {
    material: "Canvas",
    size: "A3",
    frame: "With Frame",
    price: 79.99,
    sku: "A3-CANVAS-FRAME"
  },

  // 50x70cm - All paper types and frame options
  {
    material: "Standard Paper",
    size: "50x70cm",
    frame: "None",
    price: 39.99,
    sku: "50X70-STANDARD-NOFRAME"
  },
  {
    material: "Standard Paper",
    size: "50x70cm",
    frame: "With Frame",
    price: 89.99,
    sku: "50X70-STANDARD-FRAME"
  },
  {
    material: "Premium Paper",
    size: "50x70cm",
    frame: "None",
    price: 44.99,
    sku: "50X70-PREMIUM-NOFRAME"
  },
  {
    material: "Premium Paper",
    size: "50x70cm",
    frame: "With Frame",
    price: 94.99,
    sku: "50X70-PREMIUM-FRAME"
  },
  {
    material: "Canvas",
    size: "50x70cm",
    frame: "None",
    price: 49.99,
    sku: "50X70-CANVAS-NOFRAME"
  },
  {
    material: "Canvas",
    size: "50x70cm",
    frame: "With Frame",
    price: 99.99,
    sku: "50X70-CANVAS-FRAME"
  }
]

=======
// Demo mode configuration
const DEMO_VARIANTS: GelatoVariant[] = [
  {
    templateVariantId: "a4_premium_noframe",
    material: "premium_paper",
    size: "A4",
    frame: "none"
  },
  {
    templateVariantId: "50x70_premium_noframe", 
    material: "premium_paper",
    size: "50x70cm",
    frame: "none"
  }
]

// Production variants using real template IDs from your Gelato account
const PRODUCTION_VARIANTS: GelatoVariant[] = [
  // Primary template: c1b88548-76fc-49ca-9dfc-a8be855b25f1 (Poster/Wall Art)
  // Different sizes and materials
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "A4",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "A3",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "30x40cm",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "50x70cm",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "70x100cm",
    frame: "none"
  },
  
  // With black frames
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "A4",
    frame: "black"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "A3",
    frame: "black"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "30x40cm",
    frame: "black"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "50x70cm",
    frame: "black"
  },
  
  // With white frames
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "A4",
    frame: "white"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "A3",
    frame: "white"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "30x40cm",
    frame: "white"
  },
  
  // Canvas variants (no frames)
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "canvas",
    size: "A4",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "canvas",
    size: "A3",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "canvas",
    size: "30x40cm",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "canvas",
    size: "50x70cm",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "canvas",
    size: "70x100cm",
    frame: "none"
  },
  
  // Square formats
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "30x30cm",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "30x30cm",
    frame: "black"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "premium_paper",
    size: "50x50cm",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "canvas",
    size: "30x30cm",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "canvas",
    size: "50x50cm",
    frame: "none"
  },
  
  // Standard paper options
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "standard_paper",
    size: "A4",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "standard_paper",
    size: "A3",
    frame: "none"
  },
  {
    templateVariantId: "c1b88548-76fc-49ca-9dfc-a8be855b25f1",
    material: "standard_paper",
    size: "30x40cm",
    frame: "none"
  },
  
  // Alternative template: a955b726-536f-422a-844b-b54e63f7c436 (if different product type)
  {
    templateVariantId: "a955b726-536f-422a-844b-b54e63f7c436",
    material: "premium_paper",
    size: "A4",
    frame: "none"
  }
]

// Use the first real template as the main template
const GELATO_TEMPLATE_ID = "c1b88548-76fc-49ca-9dfc-a8be855b25f1"

>>>>>>> dededd1 (Please p)
export async function POST(request: NextRequest) {
  try {
    const body: ProductCreationRequest = await request.json()
    
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY
<<<<<<< HEAD
    const shopifyDomain = process.env.SHOPIFY_SHOP_DOMAIN
    const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN
=======
    const gelatoApiKey = process.env.GELATO_API_KEY
>>>>>>> dededd1 (Please p)
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    if (!body.file?.publicUrl) {
      throw new Error('File URL is required')
    }

    // Initialize clients
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null

    // Create log function
    const log = async (level: string, message: string, context?: any, productId?: string) => {
      try {
        await supabase.from('log').insert({
          level,
          message,
          context,
          product_id: productId
        })
      } catch (logError) {
        console.error('Failed to log:', logError)
      }
      console.log(`[${level}] ${message}`, context)
    }

    await log('INFO', 'Starting product creation workflow', { 
      fileUrl: body.file.publicUrl, 
      demoMode: body.demoMode 
    })

    // Step 1: Store image upload record
    const { data: imageUpload, error: uploadError } = await supabase
      .from('image_upload')
      .insert({
        url: body.file.publicUrl,
        filename: body.file.filename,
        content_type: body.file.contentType,
        size_bytes: body.file.sizeBytes,
        user_id: body.userId
      })
      .select()
      .single()

    if (uploadError) {
      await log('ERROR', 'Failed to store image upload', uploadError)
      throw uploadError
    }

    await log('INFO', 'Image upload stored', { uploadId: imageUpload.id })

    // Step 2: Create product record
    const { data: product, error: productError } = await supabase
      .from('product')
      .insert({
        status: 'PROCESSING',
        image_upload_id: imageUpload.id,
        user_id: body.userId
      })
      .select()
      .single()

    if (productError) {
      await log('ERROR', 'Failed to create product record', productError)
      throw productError
    }

    await log('INFO', 'Product record created', { productId: product.id })

<<<<<<< HEAD
    // Step 3: Generate AI-powered metadata
    let metadata = {
      title: 'Custom Art Print',
      description: 'High-quality art print perfect for home or office decoration. Available in multiple sizes and materials.'
=======
    // Step 3: Generate AI-powered metadata (optional if Anthropic is configured)
    let metadata = {
      title: 'Custom Art Print',
      description: 'High-quality poster print perfect for home or office decoration. Premium paper with vibrant colors.'
>>>>>>> dededd1 (Please p)
    }

    if (anthropic) {
      try {
        metadata = await generateProductMetadata(anthropic, body.file.publicUrl)
        await log('INFO', 'Generated AI metadata', metadata, product.id)
      } catch (metadataError) {
        await log('WARN', 'Failed to generate AI metadata, using fallback', metadataError, product.id)
      }
    } else {
      await log('INFO', 'Using fallback metadata (Anthropic not configured)', {}, product.id)
    }

    // Step 4: Determine which variants to create
    const isActuallyDemoMode = body.demoMode === true || process.env.DEMO_MODE === 'true'
    const variants = isActuallyDemoMode ? DEMO_VARIANTS : PRODUCTION_VARIANTS
    
    await log('INFO', `Running in ${isActuallyDemoMode ? 'DEMO' : 'PRODUCTION'} mode`, { 
      requestDemoMode: body.demoMode, 
      envDemoMode: process.env.DEMO_MODE,
      variantCount: variants.length 
    }, product.id)
    
    // Step 5: Create product variants in database
    const { error: variantError } = await supabase
      .from('variant')
      .insert(
<<<<<<< HEAD
        variants.map((v: ShopifyVariant) => ({
          product_id: product.id,
          material: v.material,
          size: v.size,
          frame: v.frame,
          price: v.price,
          sku: v.sku,
=======
        variants.map((v: GelatoVariant) => ({
          product_id: product.id,
          template_variant_id: v.templateVariantId,
          material: v.material,
          size: v.size,
          frame: v.frame,
>>>>>>> dededd1 (Please p)
          status: 'PROCESSING'
        }))
      )

    if (variantError) {
      await log('ERROR', 'Failed to create variant records', variantError, product.id)
      throw variantError
    }

    await log('INFO', `Created ${variants.length} variant records`, { count: variants.length }, product.id)

<<<<<<< HEAD
    // Step 6: Create product in Shopify (if API credentials are configured and not in demo mode)
    let shopifyProduct = null
    let shopifyError = null
    const hasValidShopifyConfig = shopifyDomain && shopifyAccessToken && shopifyDomain !== 'your-shop-name.myshopify.com'
    
    if (hasValidShopifyConfig && !isActuallyDemoMode) {
      try {
        await log('INFO', 'Attempting Shopify product creation...', { 
          domain: shopifyDomain,
          hasToken: !!shopifyAccessToken,
          variantCount: variants.length 
        }, product.id)
        
        shopifyProduct = await createShopifyProduct(body.file.publicUrl, variants, metadata)
        await log('INFO', 'Shopify product created successfully', { 
          shopifyId: shopifyProduct.id,
          title: shopifyProduct.title,
          status: shopifyProduct.status,
          variantCount: shopifyProduct.variants?.length 
        }, product.id)
      } catch (error) {
        shopifyError = error
        await log('ERROR', 'Shopify product creation failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        }, product.id)
        
        // Log the specific error for debugging but don't stop the process
        console.error('Detailed Shopify error:', error)
      }
    } else {
      const reasons = []
      if (!shopifyDomain || shopifyDomain === 'your-shop-name.myshopify.com') reasons.push('shop domain not configured')
      if (!shopifyAccessToken) reasons.push('access token not configured')
      if (isActuallyDemoMode) reasons.push('demo mode enabled')
      
      await log('INFO', `Skipping Shopify integration (${reasons.join(', ')})`, { 
        isDemo: isActuallyDemoMode,
        hasDomain: !!(shopifyDomain && shopifyDomain !== 'your-shop-name.myshopify.com'),
        hasToken: !!shopifyAccessToken
      }, product.id)
    }

    // Step 7: Update product with metadata and Shopify ID
    const updateData: any = {
      title: metadata.title,
      description: metadata.description,
      status: shopifyProduct ? 'READY' : 'READY'  // Always set to READY since we're handling creation synchronously
    }

    if (shopifyProduct) {
      updateData.shopify_id = shopifyProduct.id
      updateData.shopify_status = shopifyProduct.status
      updateData.shopify_url = `https://${shopifyDomain}/admin/products/${shopifyProduct.id}`
=======
    // Step 6: Create product in Gelato (if API key is configured and not in demo mode)
    let gelatoProduct = null
    const hasValidGelatoConfig = gelatoApiKey && process.env.GELATO_STORE_ID && process.env.GELATO_STORE_ID !== '123e4567-e89b-12d3-a456-426614174000'
    
    if (hasValidGelatoConfig && !isActuallyDemoMode) {
      try {
        gelatoProduct = await createGelatoProduct(body.file.publicUrl, variants, metadata)
        await log('INFO', 'Gelato product created', { gelatoId: gelatoProduct.id }, product.id)
      } catch (gelatoError) {
        await log('ERROR', 'Gelato product creation failed', gelatoError, product.id)
        // Don't throw - continue without Gelato integration
        await log('WARN', 'Continuing without Gelato integration due to API error', {}, product.id)
      }
    } else {
      const reasons = []
      if (!gelatoApiKey) reasons.push('API key not configured')
      if (!process.env.GELATO_STORE_ID || process.env.GELATO_STORE_ID === '123e4567-e89b-12d3-a456-426614174000') reasons.push('store ID not configured')
      if (isActuallyDemoMode) reasons.push('demo mode enabled')
      
      await log('INFO', `Skipping Gelato integration (${reasons.join(', ')})`, { 
        isDemo: isActuallyDemoMode,
        hasApiKey: !!gelatoApiKey,
        hasValidStoreId: !!(process.env.GELATO_STORE_ID && process.env.GELATO_STORE_ID !== '123e4567-e89b-12d3-a456-426614174000')
      }, product.id)
    }

    // Step 7: Update product with metadata and Gelato ID
    const updateData: any = {
      title: metadata.title,
      description: metadata.description,
      status: gelatoProduct ? 'PROCESSING' : 'READY'
    }

    if (gelatoProduct) {
      updateData.gelato_id = gelatoProduct.id
>>>>>>> dededd1 (Please p)
    }

    const { error: updateError } = await supabase
      .from('product')
      .update(updateData)
      .eq('id', product.id)

    if (updateError) {
      await log('ERROR', 'Failed to update product', updateError, product.id)
      throw updateError
    }

<<<<<<< HEAD
    // Update variants to READY
    await supabase
      .from('variant')
      .update({ status: 'READY' })
      .eq('product_id', product.id)

    await log('INFO', 'Product creation completed', { 
      productId: product.id, 
      hasShopify: !!shopifyProduct,
      shopifyError: shopifyError ? (shopifyError instanceof Error ? shopifyError.message : 'Unknown error') : null,
      mode: isActuallyDemoMode ? 'DEMO' : 'PRODUCTION'
    }, product.id)

    // Return enhanced response with detailed status
    const responseMessage = shopifyProduct 
      ? `Product created successfully in Shopify! View it at: https://${shopifyDomain}/admin/products/${shopifyProduct.id}`
      : shopifyError
        ? `Product created in database but Shopify creation failed: ${shopifyError instanceof Error ? shopifyError.message : 'Unknown error'}`
        : isActuallyDemoMode 
          ? 'Product created successfully in demo mode.'
          : 'Product created successfully without Shopify integration.'
=======
    // Update variants to READY if no Gelato integration
    if (!gelatoProduct) {
      await supabase
        .from('variant')
        .update({ status: 'READY' })
        .eq('product_id', product.id)
    }

    await log('INFO', 'Product creation completed', { 
      productId: product.id, 
      hasGelato: !!gelatoProduct,
      mode: isActuallyDemoMode ? 'DEMO' : 'PRODUCTION'
    }, product.id)

    // Return response with correct messaging
    const responseMessage = gelatoProduct 
      ? 'Product creation started with Gelato integration. Check status for updates.'
      : isActuallyDemoMode 
        ? 'Product created successfully in demo mode.'
        : 'Product created successfully without Gelato integration.'
>>>>>>> dededd1 (Please p)

    return NextResponse.json({
      success: true,
      productId: product.id,
<<<<<<< HEAD
      shopifyId: shopifyProduct?.id,
      shopifyUrl: shopifyProduct ? `https://${shopifyDomain}/admin/products/${shopifyProduct.id}` : null,
      shopifyStatus: shopifyProduct?.status,
      shopifyError: shopifyError ? (shopifyError instanceof Error ? shopifyError.message : 'Unknown error') : null,
      status: 'READY',
      mode: isActuallyDemoMode ? 'DEMO' : 'PRODUCTION',
      message: responseMessage,
      metadata,
      variantCount: variants.length
=======
      gelatoId: gelatoProduct?.id,
      status: gelatoProduct ? 'PROCESSING' : 'READY',
      mode: isActuallyDemoMode ? 'DEMO' : 'PRODUCTION',
      message: responseMessage,
      metadata
>>>>>>> dededd1 (Please p)
    })

  } catch (error) {
    console.error('Orchestrator API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// AI metadata generation
async function generateProductMetadata(anthropic: Anthropic, imageUrl: string): Promise<{ title: string; description: string }> {
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1000,
    temperature: 0,
    messages: [{
      role: 'user',
<<<<<<< HEAD
      content: `Generate product metadata for an art print based on this image: ${imageUrl}
=======
      content: `Generate product metadata for a poster/art print based on this image: ${imageUrl}
>>>>>>> dededd1 (Please p)

Return a JSON object with:
- title: Compelling product title (max 60 chars)
- description: SEO-optimized description (max 300 chars)

<<<<<<< HEAD
Focus on artistic style, colors, mood, and potential use cases. Make it commercially appealing for an art print/poster.`
=======
Focus on artistic style, colors, mood, and potential use cases. Make it commercially appealing.`
>>>>>>> dededd1 (Please p)
    }],
    tools: [{
      name: 'generate_metadata',
      description: 'Generate product metadata for artwork',
      input_schema: {
        type: 'object',
        properties: {
          title: { type: 'string', maxLength: 60 },
          description: { type: 'string', maxLength: 300 }
        },
        required: ['title', 'description']
      }
    }]
  })

  const toolUse = response.content.find(c => c.type === 'tool_use')
  if (toolUse && toolUse.type === 'tool_use') {
    const input = toolUse.input as { title: string; description: string }
    
    console.log('AI generated metadata:', input)
    
    const result = {
      title: input.title,
      description: input.description
    }
    
    console.log('Final metadata:', result)
    return result
  }

<<<<<<< HEAD
  // Fallback metadata
  const fallback = {
    title: 'Custom Art Print',
    description: 'High-quality art print perfect for home or office decoration. Available in multiple sizes and materials.'
=======
  // Fallback metadata without tags
  const fallback = {
    title: 'Custom Art Print',
    description: 'High-quality poster print perfect for home or office decoration. Premium paper with vibrant colors.'
>>>>>>> dededd1 (Please p)
  }
  
  console.log('Using fallback metadata:', fallback)
  return fallback
}

<<<<<<< HEAD
// Shopify API integration
async function createShopifyProduct(imageUrl: string, variants: ShopifyVariant[], metadata: any) {
  const shopifyDomain = process.env.SHOPIFY_SHOP_DOMAIN
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN
  
  if (!shopifyDomain || !accessToken) {
    throw new Error('Shopify credentials not configured')
  }
  
  // First, ensure we have an Artify Agent collection
  let collectionId: number | null = null
  try {
    collectionId = await ensureArtifyCollection(shopifyDomain, accessToken)
    console.log('Using collection ID:', collectionId)
  } catch (collectionError) {
    console.warn('Failed to create/get collection, proceeding without:', collectionError)
  }
  
  // Create the product payload WITHOUT images first - we'll add images separately
  const productData = {
    product: {
      title: metadata.title,
      body_html: `<p>${metadata.description}</p>`,
      product_type: "Art Print",
      vendor: "Artify Agent",
      status: "active",  // Make products active so they're visible in storefront
      published: true,   // Ensure they're published
      options: [
        {
          name: "Size",
          values: ["A4", "A3", "50x70cm"]
        },
        {
          name: "Material", 
          values: ["Standard Paper", "Premium Paper", "Canvas"]
        },
        {
          name: "Frame",
          values: ["None", "With Frame"]
        }
      ],
      variants: variants.map((variant) => ({
        option1: variant.size,
        option2: variant.material,
        option3: variant.frame,
        price: variant.price.toString(),
        sku: variant.sku,
        inventory_quantity: 1000,
        inventory_management: null,
        weight: 0.5,
        weight_unit: "kg",
        requires_shipping: true,
        taxable: true,
        fulfillment_service: "manual",
        inventory_policy: "continue"  // Allow selling when out of stock
      })),
      tags: "art,print,custom,poster,wall-art,artify-agent",
      seo_title: metadata.title,
      seo_description: metadata.description
    }
  }

  console.log('Shopify API Request URL:', `https://${shopifyDomain}/admin/api/2023-10/products.json`)
  console.log('Shopify API Request Method: POST')
  console.log('Product title being created:', metadata.title)
  console.log('🖼️ Image will be added separately after product creation')

  try {
    const response = await fetch(`https://${shopifyDomain}/admin/api/2023-10/products.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(productData)
    })

    const responseText = await response.text()
    console.log('Shopify API Response Status:', response.status)
    console.log('Shopify API Response Body Length:', responseText.length)

    if (!response.ok) {
      let errorMessage = `Shopify API error: ${response.status}`
      
      try {
        const errorData = JSON.parse(responseText)
        if (errorData.errors) {
          if (typeof errorData.errors === 'string') {
            errorMessage += ` - ${errorData.errors}`
          } else if (typeof errorData.errors === 'object') {
            const errorDetails = Object.keys(errorData.errors).map(key => 
              `${key}: ${Array.isArray(errorData.errors[key]) ? errorData.errors[key].join(', ') : errorData.errors[key]}`
            ).join('; ')
            errorMessage += ` - ${errorDetails}`
          }
        }
      } catch (parseError) {
        errorMessage += ` - ${responseText}`
      }
      
      throw new Error(errorMessage)
    }

    let result
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      throw new Error(`Failed to parse Shopify response: ${responseText}`)
    }

    console.log('Parsed Response Structure:', Object.keys(result))
    let createdProduct: any = null

    // Handle the normal case where we get a single product back
    if (result.product) {
      createdProduct = result.product
      console.log('✅ Shopify Product Created Successfully:', {
        id: createdProduct.id,
        title: createdProduct.title,
        status: createdProduct.status,
        vendor: createdProduct.vendor,
        variants: createdProduct.variants?.length || 0
      })
    } 
    // Handle edge cases where we get unexpected response format
    else if (result.products && Array.isArray(result.products)) {
      console.log('⚠️  Received products list instead of single product')
      
      // If the list contains our product, return it
      const matchingProduct = result.products.find((p: any) => p.title === metadata.title)
      if (matchingProduct) {
        createdProduct = matchingProduct
        console.log('✅ Found matching product in response list:', matchingProduct.id)
      }
    }
    
    // If we still don't have the product, try to find it by searching
    if (!createdProduct) {
      console.log('⏳ Waiting 3 seconds for product to be indexed...')
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Search for the product by vendor and recent creation time
      const searchResponse = await fetch(`https://${shopifyDomain}/admin/api/2023-10/products.json?vendor=Artify Agent&limit=50`, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Accept': 'application/json'
        }
      })

      if (searchResponse.ok) {
        const searchResult = await searchResponse.json()
        console.log('🔍 Search found', searchResult.products?.length || 0, 'Artify Agent products')
        
        if (searchResult.products && searchResult.products.length > 0) {
          // Find the most recent product (created in the last 2 minutes)
          const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
          const recentProducts = searchResult.products
            .filter((p: any) => {
              const createdAt = new Date(p.created_at)
              return createdAt >= twoMinutesAgo
            })
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          
          console.log('🕐 Found', recentProducts.length, 'products created in the last 2 minutes')
          
          if (recentProducts.length > 0) {
            createdProduct = recentProducts[0]
            console.log('✅ Using most recent product:', {
              id: createdProduct.id,
              title: createdProduct.title,
              created_at: createdProduct.created_at,
              vendor: createdProduct.vendor
            })
          }
        }
      }
    }
    
    if (!createdProduct) {
      throw new Error(`Product creation unclear: POST request succeeded but cannot locate the created product. Response format: ${JSON.stringify(Object.keys(result))}. Title searched: "${metadata.title}". Please check Shopify admin manually.`)
    }

    // Now add the image to the created product
    try {
      console.log('📸 Adding image to product:', createdProduct.id)
      await addImageToProduct(shopifyDomain, accessToken, createdProduct.id, imageUrl, metadata.title)
      console.log('✅ Image successfully added to product')
    } catch (imageError) {
      console.warn('⚠️ Failed to add image to product:', imageError)
      // Don't fail the entire process if image addition fails
    }
    
    // If we have a product and a collection, add it to the collection
    if (createdProduct && collectionId) {
      try {
        await addProductToCollection(shopifyDomain, accessToken, createdProduct.id, collectionId)
        console.log('✅ Product added to Artify Agent collection')
      } catch (collectionError) {
        console.warn('Failed to add product to collection:', collectionError)
        // Don't fail the entire process if collection assignment fails
      }
    }
    
    return createdProduct
    
  } catch (error) {
    console.error('Shopify product creation error:', error)
    throw error
  }
}

// Helper function to ensure Artify Agent collection exists
async function ensureArtifyCollection(shopifyDomain: string, accessToken: string): Promise<number> {
  // First, check if the collection already exists
  const getResponse = await fetch(`https://${shopifyDomain}/admin/api/2023-10/custom_collections.json?handle=artify-agent`, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Accept': 'application/json'
    }
  })
  
  if (getResponse.ok) {
    const getResult = await getResponse.json()
    if (getResult.custom_collections && getResult.custom_collections.length > 0) {
      const existingCollection = getResult.custom_collections[0]
      console.log('Found existing Artify Agent collection:', existingCollection.id)
      return existingCollection.id
    }
  }
  
  // Collection doesn't exist, create it
  console.log('Creating new Artify Agent collection...')
  const collectionData = {
    custom_collection: {
      title: "Artify Agent",
      handle: "artify-agent",
      body_html: "<p>AI-generated art prints created by Artify Agent</p>",
      published: true,
      sort_order: "created-desc"
    }
  }
  
  const createResponse = await fetch(`https://${shopifyDomain}/admin/api/2023-10/custom_collections.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(collectionData)
  })
  
  if (!createResponse.ok) {
    const errorText = await createResponse.text()
    throw new Error(`Failed to create collection: ${createResponse.status} - ${errorText}`)
  }
  
  const createResult = await createResponse.json()
  console.log('Collection creation response:', JSON.stringify(createResult, null, 2))
  
  // Handle different possible response structures
  if (createResult.custom_collection && createResult.custom_collection.id) {
    const newCollection = createResult.custom_collection
    console.log('✅ Created new Artify Agent collection:', newCollection.id)
    return newCollection.id
  } else if (createResult.collection && createResult.collection.id) {
    // Alternative response structure
    const newCollection = createResult.collection
    console.log('✅ Created new Artify Agent collection (alt structure):', newCollection.id)
    return newCollection.id
  } else {
    console.error('Unexpected collection creation response structure:', createResult)
    throw new Error(`Unexpected collection creation response: ${JSON.stringify(createResult)}`)
  }
}

// Helper function to add product to collection
async function addProductToCollection(shopifyDomain: string, accessToken: string, productId: number, collectionId: number): Promise<void> {
  const collectData = {
    collect: {
      product_id: productId,
      collection_id: collectionId
    }
  }
  
  const response = await fetch(`https://${shopifyDomain}/admin/api/2023-10/collects.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(collectData)
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to add product to collection: ${response.status} - ${errorText}`)
  }
  
  console.log('Product successfully added to collection')
}

// Helper function to add image to an existing product
async function addImageToProduct(shopifyDomain: string, accessToken: string, productId: number, imageUrl: string, altText: string): Promise<void> {
  const imageData = {
    image: {
      src: imageUrl,
      alt: altText,
      position: 1
    }
  }
  
  console.log('Adding image with URL:', imageUrl)
  
  const response = await fetch(`https://${shopifyDomain}/admin/api/2023-10/products/${productId}/images.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(imageData)
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to add image to product: ${response.status} - ${errorText}`)
  }
  
  const result = await response.json()
  console.log('Image added successfully:', result.image?.src)
=======
// Gelato API integration
async function createGelatoProduct(imageUrl: string, variants: GelatoVariant[], metadata: any) {
  const gelatoApiKey = process.env.GELATO_API_KEY
  const storeId = process.env.GELATO_STORE_ID || '123e4567-e89b-12d3-a456-426614174000'
  
  if (!gelatoApiKey) {
    throw new Error('Gelato API key not configured')
  }
  
  const payload = {
    templateId: GELATO_TEMPLATE_ID,
    title: metadata.title,
    description: metadata.description,
    imagePlaceholders: [{
      name: 'ImageFront',
      fileUrl: imageUrl
    }],
    variants: variants.map(v => ({
      templateVariantId: v.templateVariantId
    }))
  }

  console.log('Gelato API Request:', JSON.stringify(payload, null, 2))

  const response = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${storeId}/products:create-from-template`, {
    method: 'POST',
    headers: {
      'X-API-KEY': gelatoApiKey,
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID()
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Gelato API Error Response:', errorText)
    throw new Error(`Gelato API error: ${response.status} ${errorText}`)
  }

  const result = await response.json()
  console.log('Gelato API Success Response:', JSON.stringify(result, null, 2))
  return result
>>>>>>> dededd1 (Please p)
} 