Project Name: AI-Agent × Gelato Product Automation System
Core Purpose: Automate the entire product creation pipeline for a Gelato-powered poster store
Problem Statement

Manual creation of 20-30 product variants per artwork upload is slow and error-prone
Store owners waste hours creating size/material/frame combinations
Inconsistent metadata and pricing across variants

Solution
An AI-driven orchestrator that:

Accepts a single artwork file upload
Automatically generates all product variants (size × material × frame)
Pushes everything to Gelato's print-on-demand platform
Optionally syncs to Shopify/Etsy marketplaces
Completely hands-off operation

Success Metrics

Speed: ≤ 60 seconds from upload to live product with 100% variant coverage
Demo Mode: ≤ 30 seconds for 2 demo variants in Gelato Sandbox

🏗️ System Architecture
Technology Stack

Frontend: React with TypeScript, Vite, Tailwind CSS, shadcn/ui
Backend: Supabase Edge Functions (Node.js runtime)
AI Layer: Claude 3 (Sonnet for production, Haiku for demo)
Database: Supabase PostgreSQL with Row-Level Security
Storage: Supabase Storage / S3 / Cloudinary for artwork files
APIs: Gelato Connect API, Shopify/Etsy APIs

Architecture Flow
User → Web App → AI Orchestrator → Gelato API
                       ↓
                  Supabase DB
                       ↓
              Shopify/Etsy (optional)
📊 Database Schema
Your Supabase database includes:

image_upload table

Stores uploaded artwork URLs and metadata
Tracks user ownership


product table

Links to Gelato product IDs
Stores enriched metadata (title, description)
Tracks sync status with external platforms


variant table

Individual product variants
Maps template variant IDs to actual products
Stores material, size, frame combinations


log table

System logs for debugging
Tracks workflow progress



🚀 Workflow Details
Step-by-Step Process:

Upload & Validation

Accept jpg/png/tiff/pdf files up to 300MB
Enforce minimum 300 DPI for largest print size
Frontend shows real-time upload progress


Storage & URL Generation

Push to cloud storage (Supabase Storage/S3/Cloudinary)
Generate public URL accessible for at least 2 hours


Template Fetching

GET /v3/templates/{templateId} from Gelato
Cache template data for 30 minutes to reduce API calls


Variant Mapping

AI agent maps all combinations: material × size × frame
Lookup corresponding templateVariantId for each combination


Product Creation

POST to Gelato's /v3/products-from-template endpoint
Pass artwork URL in imagePlaceholders array
Gelato pulls the image from provided URL


Status Polling

Check product status until "READY"
Exponential backoff with max 5 retry attempts


Metadata Enrichment

Claude generates SEO-optimized title, description, and tags
Multi-locale support for international markets


Publishing

Push to Shopify/Etsy via their respective APIs
Map Gelato SKUs to marketplace listings


User Notification

Real-time updates via Supabase Realtime
Email/Slack notifications on completion



🎮 Demo Mode Configuration
For proof-of-concept demonstrations:
FeatureDemo SettingProduction SettingVariants2 only (A4, 50×70cm)All combinationsMaterialPremium paper onlyMultiple optionsFramesNoneMultiple optionsGelato EnvironmentSandbox APIProduction APIAI ModelClaude 3 HaikuClaude 3 SonnetPublishingJSON response onlyFull marketplace syncDatabaseFree tier, no RLSFull RLS enabledCleanupDaily truncationPersistent data
🔧 Current Implementation Status
Based on your codebase, you have:
✅ Completed Components:

Frontend UI with file upload zone
Workflow visualization showing progress steps
Product preview component
System logs panel for monitoring
Demo/Production mode toggle

🚧 Integration Points Needed:

Supabase Edge Function deployment for orchestrator
Gelato API credentials setup
Claude API integration for metadata generation
Webhook endpoints for async processing
Error handling and retry logic

🔐 Security & Compliance

Authentication: Supabase Auth with JWT tokens
Authorization: Row-Level Security on all tables
API Keys: Stored in Supabase Secrets/AWS Secrets Manager
GDPR Compliance: User data deletion cascades through all tables
Rate Limiting: Respect Gelato's 600 RPM limit

📈 Performance Optimization

Template Caching: 30-minute cache to reduce API calls
Concurrent Processing: Limited to prevent rate limit issues
Image Optimization: Automatic resizing for web previews
Database Indexing: On frequently queried columns

🔮 Future Enhancements

Supabase Vectors for AI-powered image similarity search
GraphQL subscriptions for real-time order updates
Batch processing for multiple artwork uploads
A/B testing for optimal pricing strategies
Analytics dashboard for sales insights

⚙️ Quick Start Commands
bash# Local development
npm install
npm run dev

# Supabase setup
supabase start
supabase db push

# Deploy Edge Function
supabase functions deploy orchestrator --project-ref $SUPABASE_REF

# Environment variables needed
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
GELATO_API_KEY=your_gelato_key
ANTHROPIC_API_KEY=your_claude_key
📝 Key Configuration Files

.env - Environment variables
supabase/migrations/ - Database schema
supabase/functions/orchestrator/ - AI agent logic
src/lib/gelato.ts - Gelato API client
src/lib/supabase.ts - Database client