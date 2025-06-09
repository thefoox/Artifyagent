const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Debug: Log what we're reading
console.log('🔧 Debug Environment Variables:');
console.log('   SHOPIFY_SHOP_DOMAIN:', process.env.SHOPIFY_SHOP_DOMAIN);
console.log('   SHOPIFY_API_KEY:', process.env.SHOPIFY_API_KEY ? process.env.SHOPIFY_API_KEY.substring(0, 10) + '...' : 'undefined');
console.log('   SHOPIFY_API_SECRET:', process.env.SHOPIFY_API_SECRET ? process.env.SHOPIFY_API_SECRET.substring(0, 10) + '...' : 'undefined');
console.log('   SHOPIFY_ACCESS_TOKEN:', process.env.SHOPIFY_ACCESS_TOKEN ? process.env.SHOPIFY_ACCESS_TOKEN.substring(0, 10) + '...' : 'undefined');
console.log('   DEMO_MODE:', process.env.DEMO_MODE);
console.log('');

// Test data for creating a product
const testProduct = {
  product: {
    title: "Test Art Print - Artify Agent",
    body_html: "<p>This is a test product created by Artify Agent to verify Shopify integration.</p>",
    product_type: "Art Print",
    vendor: "Artify Agent",
    status: "draft", // Create as draft so it doesn't go live
    tags: "test,art,print,artify-agent",
    options: [
      {
        name: "Size",
        values: ["A4", "A3"]
      },
      {
        name: "Material",
        values: ["Premium Paper"]
      }
    ],
    variants: [
      {
        title: "A4 - Premium Paper",
        price: "29.99",
        sku: "TEST-A4-PREMIUM",
        inventory_quantity: 1000,
        inventory_management: null,
        option1: "A4",           // Maps to Size option
        option2: "Premium Paper", // Maps to Material option
        weight: 0.5,
        weight_unit: "kg",
        requires_shipping: true,
        taxable: true
      },
      {
        title: "A3 - Premium Paper", 
        price: "39.99",
        sku: "TEST-A3-PREMIUM",
        inventory_quantity: 1000,
        inventory_management: null,
        option1: "A3",           // Maps to Size option  
        option2: "Premium Paper", // Maps to Material option
        weight: 0.5,
        weight_unit: "kg", 
        requires_shipping: true,
        taxable: true
      }
    ]
  }
};

async function testShopifyConnection() {
  const shopifyDomain = process.env.SHOPIFY_SHOP_DOMAIN;
  const apiKey = process.env.SHOPIFY_API_KEY;
  const apiSecret = process.env.SHOPIFY_API_SECRET;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  
  console.log('🔍 Testing Shopify Connection...\n');
  
  // Check if credentials are configured
  if (!shopifyDomain || shopifyDomain === 'your-shop-name.myshopify.com') {
    console.error('❌ SHOPIFY_SHOP_DOMAIN not configured in .env.local');
    console.log('   Please set it to: your-actual-shop.myshopify.com');
    return false;
  }
  
  console.log(`🏪 Shop Domain: ${shopifyDomain}`);
  
  // Try different authentication methods
  let authSuccess = false;
  let workingHeaders = null;
  
  // Method 1: Try new API Key + Secret (Basic Auth)
  if (apiKey && apiSecret) {
    console.log('🔑 Trying API Key + Secret authentication...');
    const basicAuth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const basicAuthHeaders = {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json'
    };
    
    try {
      const shopResponse = await fetch(`https://${shopifyDomain}/admin/api/2023-10/shop.json`, {
        headers: basicAuthHeaders
      });
      
      if (shopResponse.ok) {
        console.log('✅ API Key + Secret authentication successful!');
        workingHeaders = basicAuthHeaders;
        authSuccess = true;
      } else {
        console.log(`❌ API Key + Secret failed: ${shopResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ API Key + Secret error: ${error.message}`);
    }
  }
  
  // Method 2: Try Access Token (Bearer)
  if (!authSuccess && accessToken && accessToken !== 'shpat_your-access-token') {
    console.log('🔑 Trying Access Token authentication...');
    const tokenHeaders = {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    };
    
    try {
      const shopResponse = await fetch(`https://${shopifyDomain}/admin/api/2023-10/shop.json`, {
        headers: tokenHeaders
      });
      
      if (shopResponse.ok) {
        console.log('✅ Access Token authentication successful!');
        workingHeaders = tokenHeaders;
        authSuccess = true;
      } else {
        console.log(`❌ Access Token failed: ${shopResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Access Token error: ${error.message}`);
    }
  }
  
  if (!authSuccess) {
    console.error('❌ No working authentication method found');
    return false;
  }

  try {
    // Test: Get shop info with working authentication
    console.log('\n📡 Testing API connection...');
    const shopResponse = await fetch(`https://${shopifyDomain}/admin/api/2023-10/shop.json`, {
      headers: workingHeaders
    });
    
    if (!shopResponse.ok) {
      const errorText = await shopResponse.text();
      console.error(`❌ Failed to connect to Shopify API: ${shopResponse.status}`);
      console.error(`   Error: ${errorText}`);
      return false;
    }
    
    const shopData = await shopResponse.json();
    console.log(`✅ Connected to shop: ${shopData.shop.name}`);
    console.log(`   Shop ID: ${shopData.shop.id}`);
    console.log(`   Domain: ${shopData.shop.domain}`);
    
    // Test: Create a test product
    console.log('\n🎨 Creating test product...');
    const productResponse = await fetch(`https://${shopifyDomain}/admin/api/2023-10/products.json`, {
      method: 'POST',
      headers: workingHeaders,
      body: JSON.stringify(testProduct)
    });
    
    if (!productResponse.ok) {
      const errorText = await productResponse.text();
      console.error(`❌ Failed to create test product: ${productResponse.status}`);
      console.error(`   Error: ${errorText}`);
      return false;
    }
    
    const productData = await productResponse.json();
    const product = productData.product;
    
    console.log(`✅ Test product created successfully!`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Title: ${product.title}`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   Status: ${product.status}`);
    console.log(`   Variants: ${product.variants.length}`);
    
    // Show product URL
    console.log(`\n🔗 View in Shopify Admin:`);
    console.log(`   https://${shopifyDomain}/admin/products/${product.id}`);
    
    console.log(`\n🎉 Shopify integration is working perfectly!`);
    console.log(`   You can now use the main app to create products from uploaded images.`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error testing Shopify connection:', error.message);
    return false;
  }
}

// Run the test
console.log('🚀 Artify Agent - Shopify Integration Test\n');
testShopifyConnection().then(success => {
  if (success) {
    console.log('\n✅ All tests passed! Your Shopify integration is ready.');
  } else {
    console.log('\n❌ Tests failed. Please check your configuration and try again.');
    console.log('\n📝 Setup checklist:');
    console.log('   1. Create a private app in your Shopify admin');
    console.log('   2. Enable read_products and write_products permissions');
    console.log('   3. Copy the API credentials (either API Key+Secret or Access Token)');
    console.log('   4. Update credentials in .env.local');
  }
  
  process.exit(success ? 0 : 1);
}); 