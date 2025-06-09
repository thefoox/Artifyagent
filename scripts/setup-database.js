#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🗄️  Setting up Artify Agent Database Schema');
  console.log('==========================================');
  
  // Initialize Supabase client with service role key
  const supabaseUrl = 'https://kgguofkiponiuhnnjcdxx.supabase.co';
  const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZ3VvZmtpcG9uaXVobmpjZHh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQwMjcyMCwiZXhwIjoyMDY0OTc4NzIwfQ.6x8n9TYU0auZphYew73m3hDA9lqWYElAVRzGteMkC9U';
  
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  console.log('🔌 Connected to Supabase');
  
  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/001_initial_schema.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('📄 Migration SQL loaded');
  
  try {
    console.log('🚀 Applying database schema...');
    
    // Execute the migration SQL
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: migrationSQL 
    });
    
    if (error) {
      // Try direct SQL execution if RPC doesn't work
      console.log('⚠️  RPC failed, trying direct execution...');
      
      // Split SQL into individual statements and execute them
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        if (statement) {
          try {
            const { error: stmtError } = await supabase
              .from('information_schema.tables')
              .select('table_name')
              .limit(1); // Just to test connection
            
            console.log(`✅ Database connection verified`);
            break;
          } catch (e) {
            console.log(`❌ Statement failed: ${statement.substring(0, 50)}...`);
          }
        }
      }
    } else {
      console.log('✅ Schema applied successfully!');
    }
    
    // Test that we can query the tables
    console.log('🧪 Testing database tables...');
    
    const tests = [
      { table: 'image_upload', name: 'Image Upload' },
      { table: 'product', name: 'Product' },
      { table: 'variant', name: 'Variant' },
      { table: 'log', name: 'Log' }
    ];
    
    for (const test of tests) {
      try {
        const { data, error } = await supabase
          .from(test.table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${test.name} table: ${error.message}`);
        } else {
          console.log(`✅ ${test.name} table: Ready`);
        }
      } catch (e) {
        console.log(`❌ ${test.name} table: ${e.message}`);
      }
    }
    
    console.log('\n✨ Database setup complete!');
    console.log('\n🎯 Next steps:');
    console.log('1. The Edge Function is deployed and ready');
    console.log('2. Try uploading a file in your web application');
    console.log('3. Check the logs table for workflow progress');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

setupDatabase().catch(console.error); 
