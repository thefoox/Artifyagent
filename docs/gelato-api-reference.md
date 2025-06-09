# Gelato API Reference for AI-Agent Integration

This document contains all the Gelato API information relevant to the AI-Agent × Gelato automation project.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URLs and Environments](#base-urls-and-environments)
4. [Core Endpoints](#core-endpoints)
5. [Error Handling](#error-handling)
6. [Rate Limits](#rate-limits)
7. [Webhooks](#webhooks)
8. [Request/Response Examples](#requestresponse-examples)
9. [Best Practices](#best-practices)

---

## Overview

The Gelato API is RESTful, uses predictable resource-oriented URLs, and returns JSON for all responses. All communication must be done through HTTPS.

### Key Concepts

- **Store ID**: Your unique store identifier (UUID format)
- **Template ID**: Pre-configured product template identifier
- **Product UID**: String encapsulating product details
- **Template Variant ID**: Specific variant within a template

---

## Authentication

### API Key Authentication

All API calls require a valid API key in the header:

```http
X-API-KEY: <YOUR_GELATO_API_KEY>
```

### Important Notes

- Different API keys for test and production environments
- Never expose keys in client-side code or public repositories
- All requests must use HTTPS

---

## Base URLs and Environments

### E-commerce API (Main API for this project)

| Environment | Base URL |
|-------------|----------|
| Production | `https://ecommerce.gelatoapis.com` |
| Test/Sandbox | Contact Gelato for sandbox endpoint |

### Order API

| Environment | Base URL |
|-------------|----------|
| Production | `https://order.gelatoapis.com` |

### Product Catalog API

| Environment | Base URL |
|-------------|----------|
| Production | `https://product.gelatoapis.com` |

---

## Core Endpoints

### 1. Get Template

Retrieves template information including all available variants.

```http
GET /v1/templates/{templateId}
```

**Headers:**
```http
X-API-KEY: {apiKey}
Content-Type: application/json
```

**Response includes:**
- Template metadata
- Available variants with `templateVariantId`
- Image placeholder requirements
- Pricing information

### 2. Create Product from Template

Creates a product with all specified variants using a template.

```http
POST /v1/stores/{storeId}/products:create-from-template
```

**Headers:**
```http
X-API-KEY: {apiKey}
Content-Type: application/json
Idempotency-Key: {unique-key}
```

**Request Body:**
```json
{
  "templateId": "c12a363e-0d4e-4d96-be4b-bf4138eb8743",
  "title": "Custom Poster Title",
  "description": "High-quality poster print",
  "imagePlaceholders": [
    {
      "name": "ImageFront",
      "fileUrl": "https://cdn.example.com/artwork.jpg"
    }
  ],
  "variants": [
    {
      "templateVariantId": "83e30e31-0aee-4eca-8a8f-dceb2455cdc1"
    },
    {
      "templateVariantId": "94f41f42-1bff-5fdb-9b9g-edfc3566fde2"
    }
  ]
}
```

**Key Parameters:**
- `templateId`: The template to use as base
- `imagePlaceholders`: Array of image URLs (must be publicly accessible)
- `variants`: Array of variants to create, each with a `templateVariantId`
- `title` & `description`: Product metadata

### 3. Get Product

Check product status and retrieve details.

```http
GET /v1/stores/{storeId}/products/{productId}
```

**Response includes:**
- Product status (PROCESSING, READY, ERROR)
- Created variants with SKUs
- Mockup URLs when ready

### 4. List Products

Retrieve all products in a store.

```http
GET /v1/stores/{storeId}/products
```

**Query Parameters:**
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset
- `status`: Filter by status (READY, PROCESSING, etc.)

---

## Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters or missing required fields |
| 401 | Unauthorized - Invalid API key |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 502-504 | Server errors (rare) |

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The templateVariantId 'xyz' is not valid for template 'abc'",
    "details": {
      "field": "variants[0].templateVariantId"
    }
  }
}
```

---

## Rate Limits

### Limits

- **Standard**: 600 requests per minute (10 requests/second)
- **Burst**: Short bursts up to 100 requests/second allowed

### Rate Limit Headers

Response headers indicate your rate limit status:
```http
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 599
X-RateLimit-Reset: 1623456789
```

### Handling 429 Errors

Implement exponential backoff with jitter:

```javascript
const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
const jitter = Math.random() * 1000;
await sleep(delay + jitter);
```

---

## Webhooks

### Available Events

1. **order_status_updated** - Order status changes
2. **order_item_status_updated** - Individual item status changes
3. **store_product_created** - Product successfully created
4. **store_product_updated** - Product updated/published
5. **store_product_deleted** - Product deleted

### Webhook Payload Example

```json
{
  "id": "evt_5e5680ce494f6",
  "event": "store_product_created",
  "productId": "a6a1f9ce-2bdd-4a9e-9f8d-0009df0e24d9",
  "storeId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "READY",
  "created": "2024-08-03T07:26:52+00:00"
}
```

### Webhook Requirements

- Must be HTTPS endpoint
- Must return 2xx status code
- Retries: 3 attempts with 5-second delays
- No response body expected

---

## Request/Response Examples

### Complete Create Product Flow

#### 1. First, get template details:

```bash
curl -X GET "https://ecommerce.gelatoapis.com/v1/templates/tmpl_poster_premium" \
  -H "X-API-KEY: your_api_key"
```

#### 2. Create product with variants:

```bash
curl -X POST "https://ecommerce.gelatoapis.com/v1/stores/store_123/products:create-from-template" \
  -H "X-API-KEY: your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "templateId": "tmpl_poster_premium",
    "title": "Mountain Landscape Poster",
    "description": "Beautiful mountain scenery printed on premium paper",
    "imagePlaceholders": [
      {
        "name": "ImageFront",
        "fileUrl": "https://cdn.example.com/mountain-landscape.jpg"
      }
    ],
    "variants": [
      {
        "templateVariantId": "var_a4_premium_noframe"
      },
      {
        "templateVariantId": "var_50x70_premium_noframe"
      }
    ]
  }'
```

#### 3. Poll for status:

```bash
curl -X GET "https://ecommerce.gelatoapis.com/v1/stores/store_123/products/prod_xyz" \
  -H "X-API-KEY: your_api_key"
```

### Successful Response

```json
{
  "id": "prod_xyz",
  "storeId": "store_123",
  "templateId": "tmpl_poster_premium",
  "status": "READY",
  "title": "Mountain Landscape Poster",
  "variants": [
    {
      "id": "var_001",
      "templateVariantId": "var_a4_premium_noframe",
      "sku": "MLPA4PN001",
      "status": "READY",
      "mockups": [
        {
          "url": "https://gelato-mockups.com/mlp-a4-preview.jpg",
          "perspective": "front"
        }
      ]
    },
    {
      "id": "var_002",
      "templateVariantId": "var_50x70_premium_noframe",
      "sku": "MLP5070PN002",
      "status": "READY",
      "mockups": [
        {
          "url": "https://gelato-mockups.com/mlp-50x70-preview.jpg",
          "perspective": "front"
        }
      ]
    }
  ]
}
```

---

## Best Practices

### 1. Image Requirements

- **Format**: JPEG, PNG, PDF (CMYK preferred for print)
- **Resolution**: Minimum 300 DPI for print size
- **Color Profile**: sRGB or CMYK
- **File Size**: Max 300MB
- **Accessibility**: Must be publicly accessible via HTTPS for at least 2 hours

### 2. Idempotency

Always include an `Idempotency-Key` header for POST requests:

```javascript
const idempotencyKey = crypto.randomUUID();
```

### 3. Template Variant Mapping

Cache template data to avoid repeated API calls:

```javascript
// Cache for 30 minutes
const templateCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

async function getTemplate(templateId) {
  const cached = templateCache.get(templateId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const template = await fetchTemplate(templateId);
  templateCache.set(templateId, {
    data: template,
    timestamp: Date.now()
  });
  
  return template;
}
```

### 4. Status Polling

Implement efficient polling with exponential backoff:

```javascript
async function waitForProductReady(productId, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    const product = await getProduct(productId);
    
    if (product.status === 'READY') {
      return product;
    }
    
    if (product.status === 'ERROR') {
      throw new Error(`Product creation failed: ${product.error}`);
    }
    
    // Exponential backoff: 2s, 4s, 8s... max 30s
    const delay = Math.min(2000 * Math.pow(2, i), 30000);
    await sleep(delay);
  }
  
  throw new Error('Timeout waiting for product to be ready');
}
```

### 5. Error Handling

Always handle specific error cases:

```javascript
try {
  const product = await createProduct(data);
} catch (error) {
  if (error.status === 429) {
    // Rate limited - implement retry logic
  } else if (error.status === 400) {
    // Validation error - check error.details
  } else if (error.status === 401) {
    // Authentication error - check API key
  } else {
    // Unexpected error - log and retry
  }
}
```

---

## Additional Notes for AI-Agent Integration

### 1. Image Placeholder Naming

Always use consistent placeholder names across all products:
- Primary image: `"ImageFront"`
- Back image (if applicable): `"ImageBack"`

### 2. Variant Selection Strategy

For the demo mode (2 variants):
```javascript
const demoVariants = [
  { size: "A4", material: "premium_paper", frame: "none" },
  { size: "50x70cm", material: "premium_paper", frame: "none" }
];
```

For production (all combinations):
```javascript
const sizes = ["A4", "A3", "A2", "50x70cm", "70x100cm"];
const materials = ["premium_paper", "matte_paper", "canvas"];
const frames = ["none", "black", "white", "natural"];

const allVariants = sizes.flatMap(size =>
  materials.flatMap(material =>
    frames.map(frame => ({ size, material, frame }))
  )
);
```

### 3. Webhook Processing

Set up webhook endpoint in your Supabase Edge Function:

```javascript
export async function handleWebhook(event) {
  const { event: eventType, productId, status } = event;
  
  if (eventType === 'store_product_created' && status === 'READY') {
    // Update database
    await supabase
      .from('product')
      .update({ status: 'READY', gelato_id: productId })
      .eq('gelato_id', productId);
    
    // Trigger next steps (e.g., publish to Shopify)
    await publishToMarketplace(productId);
  }
}
```

---

## Quick Reference

### Essential Headers

```http
X-API-KEY: your_api_key
Content-Type: application/json
Idempotency-Key: unique_request_id
```

### Status Values

- `PROCESSING` - Product is being created
- `READY` - Product is ready with all variants
- `ERROR` - Product creation failed
- `DELETED` - Product has been deleted

### Common Template Variant ID Patterns

Format: `{size}_{material}_{frame}`

Examples:
- `a4_premium_noframe`
- `50x70_premium_noframe`
- `a3_matte_black`
- `70x100_canvas_natural`

---

This reference document covers all Gelato API functionality needed for the AI-Agent × Gelato automation project. For the latest updates and additional endpoints, refer to the official Gelato API documentation.