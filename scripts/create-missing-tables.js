#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

async function createMissingTables() {
  console.log('🔧 Creating Missing Database Tables');
  console.log('==================================');
  
  const supabaseUrl = 'https://kgguofkiponiuhnjcdxx.supabase.co';
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZ3VvZmtpcG9uaXVobmpjZHh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQwMjcyMCwiZXhwIjoyMDY0OTc4NzIwfQ.6x8n9TYU0auZphYew73m3hDA9lqWYElAVRzGteMkC9U';
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  // Check which tables exist
  console.log('🔍 Checking existing tables...');
  
  const tables = ['image_upload', 'product', 'variant', 'log'];
  const existingTables = [];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (!error) {
        existingTables.push(table);
        console.log(`✅ ${table} table exists`);
      } else {
        console.log(`❌ ${table} table missing`);
      }
    } catch (e) {
      console.log(`❌ ${table} table missing`);
    }
  }
  
  // Create product table if missing
  if (!existingTables.includes('product')) {
    console.log('🚀 Creating product table...');
    try {
      const { error } = await supabase.sql`
        create table if not exists public.product (
          id uuid primary key default gen_random_uuid(),
          gelato_id text unique,
          shopify_id text,
          etsy_id text,
          status text default 'PROCESSING' check (status in ('PROCESSING', 'READY', 'ERROR', 'DELETED')),
          title text,
          description text,
          tags text[],
          image_upload_id uuid references public.image_upload(id),
          created_at timestamptz default now(),
          updated_at timestamptz default now(),
          user_id uuid references auth.users(id)
        );
      `;
      
      if (error) {
        console.log('❌ Failed to create product table:', error.message);
      } else {
        console.log('✅ Product table created');
      }
    } catch (e) {
      console.log('❌ Error creating product table:', e.message);
    }
  }
  
  // Create variant table if missing
  if (!existingTables.includes('variant')) {
    console.log('🚀 Creating variant table...');
    try {
      const { error } = await supabase.sql`
        create table if not exists public.variant (
          id uuid primary key default gen_random_uuid(),
          product_id uuid references public.product(id) on delete cascade,
          template_variant_id text not null,
          sku text,
          material text,
          size text,
          frame text,
          price_cents integer,
          mockup_url text,
          status text default 'PROCESSING' check (status in ('PROCESSING', 'READY', 'ERROR')),
          created_at timestamptz default now()
        );
      `;
      
      if (error) {
        console.log('❌ Failed to create variant table:', error.message);
      } else {
        console.log('✅ Variant table created');
      }
    } catch (e) {
      console.log('❌ Error creating variant table:', e.message);
    }
  }
  
  // Test all tables again
  console.log('\n🧪 Testing all tables...');
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (!error) {
        console.log(`✅ ${table} table: Ready`);
      } else {
        console.log(`❌ ${table} table: ${error.message}`);
      }
    } catch (e) {
      console.log(`❌ ${table} table: ${e.message}`);
    }
  }
  
  console.log('\n✨ Database table creation complete!');
  console.log('🎯 Now try uploading a file to test the full workflow!');
}

createMissingTables().catch(console.error); 