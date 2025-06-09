import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration')
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Fetch product with its variants
    const { data: product, error: productError } = await supabase
      .from('product')
      .select(`
        *,
        variants:variant(*),
        image_upload:image_upload(*)
      `)
      .eq('id', productId)
      .single()
    
    if (productError) {
      if (productError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      throw productError
    }
    
    return NextResponse.json(product)
    
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
} 