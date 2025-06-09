import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.24.3'

// Orchestrator Edge Function - Updated to use modern Deno APIs
// Types
interface FileUpload {
  publicUrl: string
  filename?: string
  contentType?: string
  sizeBytes?: number
}

interface GelatoVariant {
  templateVariantId: string
  material: string
  size: string
  frame: string
}

interface ProductCreationRequest {
  file: FileUpload
  userId?: string
  demoMode?: boolean
}

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

const GELATO_TEMPLATE_ID = "c12a363e-0d4e-4d96-be4b-bf4138eb8743" // Poster template

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

    // Initialize clients
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY')
    })

    // Parse request
    const { file, userId, demoMode = true }: ProductCreationRequest = await req.json()

    if (!file?.publicUrl) {
      throw new Error('File URL is required')
    }

    // Create log function
    const log = async (level: string, message: string, context?: any, productId?: string) => {
      await supabase.from('log').insert({
        level,
        message,
        context,
        product_id: productId
      })
      console.log(`[${level}] ${message}`, context)
    }

    await log('INFO', 'Starting product creation workflow', { fileUrl: file.publicUrl, demoMode })

    // Step 1: Store image upload record
    const { data: imageUpload, error: uploadError } = await supabase
      .from('image_upload')
      .insert({
        url: file.publicUrl,
        filename: file.filename,
        content_type: file.contentType,
        size_bytes: file.sizeBytes,
        user_id: userId
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
        user_id: userId
      })
      .select()
      .single()

    if (productError) {
      await log('ERROR', 'Failed to create product record', productError)
      throw productError
    }

    await log('INFO', 'Product record created', { productId: product.id })

    // Step 3: Generate AI-powered metadata
    const metadata = await generateProductMetadata(anthropic, file.publicUrl, product.id)
    await log('INFO', 'Generated product metadata', metadata, product.id)

    // Step 4: Create product variants in database
    const variants = demoMode ? DEMO_VARIANTS : await getAllVariants()
    const { error: variantError } = await supabase
      .from('variant')
      .insert(
        variants.map(v => ({
          product_id: product.id,
          template_variant_id: v.templateVariantId,
          material: v.material,
          size: v.size,
          frame: v.frame,
          status: 'PROCESSING'
        }))
      )

    if (variantError) {
      await log('ERROR', 'Failed to create variant records', variantError, product.id)
      throw variantError
    }

    await log('INFO', `Created ${variants.length} variant records`, { count: variants.length }, product.id)

    // Step 5: Create product in Gelato
    const gelatoProduct = await createGelatoProduct(file.publicUrl, variants, metadata, product.id)
    await log('INFO', 'Gelato product created', { gelatoId: gelatoProduct.id }, product.id)

    // Step 6: Update product with Gelato ID and metadata
    const { error: updateError } = await supabase
      .from('product')
      .update({
        gelato_id: gelatoProduct.id,
        title: metadata.title,
        description: metadata.description,
        tags: metadata.tags
      })
      .eq('id', product.id)

    if (updateError) {
      await log('ERROR', 'Failed to update product with Gelato data', updateError, product.id)
      throw updateError
    }

    // Step 7: Poll for completion (async)
    pollProductStatus(supabase, product.id, gelatoProduct.id)

    // Return immediate response
    return new Response(
      JSON.stringify({
        success: true,
        productId: product.id,
        gelatoId: gelatoProduct.id,
        status: 'PROCESSING',
        message: 'Product creation started. Check status for updates.',
        metadata
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Orchestrator error:', error)
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

// AI metadata generation
async function generateProductMetadata(anthropic: Anthropic, imageUrl: string, productId: string) {
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1000,
    temperature: 0,
    messages: [{
      role: 'user',
      content: `Generate product metadata for a poster/art print based on this image: ${imageUrl}

Return a JSON object with:
- title: Compelling product title (max 60 chars)
- description: SEO-optimized description (max 300 chars)  
- tags: Array of 5-8 relevant tags for categorization

Focus on artistic style, colors, mood, and potential use cases. Make it commercially appealing.`
    }],
    tools: [{
      name: 'generate_metadata',
      description: 'Generate product metadata for artwork',
      input_schema: {
        type: 'object',
        properties: {
          title: { type: 'string', maxLength: 60 },
          description: { type: 'string', maxLength: 300 },
          tags: { 
            type: 'array', 
            items: { type: 'string' },
            minItems: 5,
            maxItems: 8
          }
        },
        required: ['title', 'description', 'tags']
      }
    }]
  })

  const toolUse = response.content.find(c => c.type === 'tool_use')
  if (toolUse && toolUse.type === 'tool_use') {
    return toolUse.input
  }

  // Fallback metadata
  return {
    title: 'Custom Art Print',
    description: 'High-quality poster print perfect for home or office decoration. Premium paper with vibrant colors.',
    tags: ['art', 'poster', 'print', 'wall-art', 'decoration']
  }
}

// Gelato API integration
async function createGelatoProduct(imageUrl: string, variants: GelatoVariant[], metadata: any, productId: string) {
  const gelatoApiKey = Deno.env.get('GELATO_API_KEY')
  const storeId = Deno.env.get('GELATO_STORE_ID') || '123e4567-e89b-12d3-a456-426614174000'
  
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

  const response = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${storeId}/products:create-from-template`, {
    method: 'POST',
    headers: {
      'X-API-KEY': gelatoApiKey!,
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID()
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gelato API error: ${response.status} ${errorText}`)
  }

  return await response.json()
}

// Status polling (runs async)
async function pollProductStatus(supabase: any, productId: string, gelatoId: string) {
  const maxAttempts = 20
  const gelatoApiKey = Deno.env.get('GELATO_API_KEY')
  const storeId = Deno.env.get('GELATO_STORE_ID') || '123e4567-e89b-12d3-a456-426614174000'

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(`https://ecommerce.gelatoapis.com/v1/stores/${storeId}/products/${gelatoId}`, {
        headers: {
          'X-API-KEY': gelatoApiKey!
        }
      })

      if (!response.ok) {
        throw new Error(`Gelato status check failed: ${response.status}`)
      }

      const gelatoProduct = await response.json()
      
      if (gelatoProduct.status === 'READY') {
        // Update product and variants in database
        await supabase.from('product').update({ status: 'READY' }).eq('id', productId)
        
        // Update variants with SKUs and mockups
        if (gelatoProduct.variants) {
          for (const variant of gelatoProduct.variants) {
            await supabase
              .from('variant')
              .update({
                status: 'READY',
                sku: variant.sku,
                mockup_url: variant.mockups?.[0]?.url
              })
              .eq('product_id', productId)
              .eq('template_variant_id', variant.templateVariantId)
          }
        }

        await supabase.from('log').insert({
          level: 'INFO',
          message: 'Product completed successfully',
          product_id: productId,
          context: { gelatoStatus: gelatoProduct.status }
        })
        
        return
      }

      if (gelatoProduct.status === 'ERROR') {
        await supabase.from('product').update({ status: 'ERROR' }).eq('id', productId)
        await supabase.from('log').insert({
          level: 'ERROR',
          message: 'Gelato product creation failed',
          product_id: productId,
          context: { gelatoError: gelatoProduct.error }
        })
        return
      }

      // Exponential backoff
      const delay = Math.min(2000 * Math.pow(2, attempt), 30000)
      await new Promise(resolve => setTimeout(resolve, delay))

    } catch (error) {
      await supabase.from('log').insert({
        level: 'WARN',
        message: `Status polling attempt ${attempt + 1} failed`,
        product_id: productId,
        context: { error: error.message }
      })

      if (attempt === maxAttempts - 1) {
        await supabase.from('product').update({ status: 'ERROR' }).eq('id', productId)
      }
    }
  }
}

// Get all variants (for production mode)
async function getAllVariants(): Promise<GelatoVariant[]> {
  // This would fetch from Gelato template API and generate all combinations
  // For now, return demo variants
  return DEMO_VARIANTS
} 