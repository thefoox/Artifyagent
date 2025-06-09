// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      image_upload: {
        Row: {
          id: string
          url: string
          checksum: string | null
          filename: string | null
          size_bytes: number | null
          content_type: string | null
          created_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          url: string
          checksum?: string | null
          filename?: string | null
          size_bytes?: number | null
          content_type?: string | null
          created_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          url?: string
          checksum?: string | null
          filename?: string | null
          size_bytes?: number | null
          content_type?: string | null
          created_at?: string
          user_id?: string | null
        }
      }
      product: {
        Row: {
          id: string
          gelato_id: string | null
          shopify_id: string | null
          etsy_id: string | null
          status: 'PROCESSING' | 'READY' | 'ERROR' | 'DELETED'
          title: string | null
          description: string | null
          tags: string[] | null
          image_upload_id: string | null
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          gelato_id?: string | null
          shopify_id?: string | null
          etsy_id?: string | null
          status?: 'PROCESSING' | 'READY' | 'ERROR' | 'DELETED'
          title?: string | null
          description?: string | null
          tags?: string[] | null
          image_upload_id?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          gelato_id?: string | null
          shopify_id?: string | null
          etsy_id?: string | null
          status?: 'PROCESSING' | 'READY' | 'ERROR' | 'DELETED'
          title?: string | null
          description?: string | null
          tags?: string[] | null
          image_upload_id?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      variant: {
        Row: {
          id: string
          product_id: string
          template_variant_id: string
          sku: string | null
          material: string | null
          size: string | null
          frame: string | null
          price_cents: number | null
          mockup_url: string | null
          status: 'PROCESSING' | 'READY' | 'ERROR'
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          template_variant_id: string
          sku?: string | null
          material?: string | null
          size?: string | null
          frame?: string | null
          price_cents?: number | null
          mockup_url?: string | null
          status?: 'PROCESSING' | 'READY' | 'ERROR'
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          template_variant_id?: string
          sku?: string | null
          material?: string | null
          size?: string | null
          frame?: string | null
          price_cents?: number | null
          mockup_url?: string | null
          status?: 'PROCESSING' | 'READY' | 'ERROR'
          created_at?: string
        }
      }
      log: {
        Row: {
          id: number
          level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' | null
          context: Record<string, any> | null
          message: string
          product_id: string | null
          logged_at: string
        }
        Insert: {
          id?: number
          level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' | null
          context?: Record<string, any> | null
          message: string
          product_id?: string | null
          logged_at?: string
        }
        Update: {
          id?: number
          level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL' | null
          context?: Record<string, any> | null
          message?: string
          product_id?: string | null
          logged_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_demo_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 