-- Add additional Shopify fields to product table
-- Migration: 003_add_shopify_fields.sql

ALTER TABLE product 
ADD COLUMN IF NOT EXISTS shopify_status TEXT,
ADD COLUMN IF NOT EXISTS shopify_url TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_shopify_status ON product(shopify_status);
CREATE INDEX IF NOT EXISTS idx_product_shopify_id ON product(shopify_id);

-- Add comments for documentation
COMMENT ON COLUMN product.shopify_status IS 'Status of the product in Shopify (draft, active, archived)';
COMMENT ON COLUMN product.shopify_url IS 'Direct URL to the product in Shopify admin';
COMMENT ON COLUMN product.shopify_id IS 'Shopify product ID for integration'; 