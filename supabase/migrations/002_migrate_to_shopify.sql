-- Migrate from Gelato to Shopify Integration
-- Remove Gelato-specific fields and update schema for Shopify

-- Update product table
alter table public.product drop column if exists gelato_id;
alter table public.product drop column if exists etsy_id;

-- Ensure shopify_id column exists and is properly indexed
alter table public.product 
  add column if not exists shopify_id text unique;

create index if not exists idx_product_shopify_id on public.product(shopify_id);

-- Update variant table for Shopify structure
alter table public.variant 
  drop column if exists template_variant_id;

-- Ensure we have all the necessary columns for Shopify variants
alter table public.variant 
  add column if not exists sku text,
  add column if not exists price decimal(10,2);

-- Drop price_cents if it exists and we have price
do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'variant' and column_name = 'price_cents') then
    -- Migrate existing price_cents to price (convert cents to dollars)
    update public.variant set price = price_cents / 100.0 where price_cents is not null and price is null;
    alter table public.variant drop column price_cents;
  end if;
end $$;

-- Add indexes for Shopify-specific queries
create index if not exists idx_variant_sku on public.variant(sku);
create index if not exists idx_variant_material on public.variant(material);
create index if not exists idx_variant_size on public.variant(size);

-- Update comments and documentation
comment on table public.product is 'Products created from uploaded artwork, integrated with Shopify';
comment on column public.product.shopify_id is 'Shopify product ID for integration';
comment on table public.variant is 'Product variants with different sizes, materials, and frames for Shopify';
comment on column public.variant.sku is 'SKU for the variant in Shopify';
comment on column public.variant.price is 'Price in dollars for the variant';

-- Update the demo cleanup function
create or replace function public.cleanup_demo_data()
returns void as $$
begin
  -- Only run if we're in demo mode (check for demo flag or specific conditions)
  if current_setting('app.demo_mode', true) = 'true' then
    truncate table public.log restart identity cascade;
    truncate table public.variant restart identity cascade;
    truncate table public.product restart identity cascade;
    truncate table public.image_upload restart identity cascade;
  end if;
end;
$$ language plpgsql security definer; 