import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Test orchestrator received request:', body)
    
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    })
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    if (!body.file?.publicUrl) {
      throw new Error('File URL is required')
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log('Supabase client created')

    // Test 1: Simple log entry
    console.log('Testing log entry...')
    const { error: logError } = await supabase.from('log').insert({
      level: 'INFO',
      message: 'Test orchestrator called',
      context: { test: true }
    })
    
    if (logError) {
      console.error('Log error:', logError)
      throw new Error(`Log error: ${logError.message}`)
    }
    
    console.log('Log entry successful')

    // Test 2: Create image upload
    console.log('Testing image upload...')
    const { data: imageUpload, error: uploadError } = await supabase
      .from('image_upload')
      .insert({
        url: body.file.publicUrl,
        filename: body.file.filename || 'test.jpg',
        content_type: 'image/jpeg',
        user_id: null
      })
      .select()
      .single()

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Upload error: ${uploadError.message}`)
    }
    
    console.log('Image upload successful:', imageUpload.id)

    // Test 3: Create product
    console.log('Testing product creation...')
    const { data: product, error: productError } = await supabase
      .from('product')
      .insert({
        status: 'READY',
        image_upload_id: imageUpload.id,
        title: 'Test Product',
        description: 'Test description',
        tags: ['test'],
        user_id: null
      })
      .select()
      .single()

    if (productError) {
      console.error('Product error:', productError)
      throw new Error(`Product error: ${productError.message}`)
    }
    
    console.log('Product creation successful:', product.id)

    return NextResponse.json({
      success: true,
      message: 'Test orchestrator completed successfully',
      data: {
        imageUploadId: imageUpload.id,
        productId: product.id
      }
    })

  } catch (error) {
    console.error('Test orchestrator error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
} 