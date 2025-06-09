# 🎨 Artify Agent - AI-Powered Print Automation

<<<<<<< HEAD
Automate your print-on-demand business with AI-powered product creation. Upload artwork and watch as AI automatically creates multiple product variants, pushes them to Shopify, and manages the entire workflow.
=======
Automate your print-on-demand business with AI-powered product creation. Upload artwork and watch as AI automatically creates multiple product variants, pushes them to Gelato, and manages the entire workflow.
>>>>>>> dededd1 (Please p)

## 🚀 Features

- **AI-Powered Automation**: Claude AI generates product metadata and orchestrates the entire workflow
<<<<<<< HEAD
- **Shopify Integration**: Automatic product creation with multiple variants (sizes, materials, frames)
- **Real-time Status Updates**: Live progress tracking from upload to ready products
- **Demo Mode**: Safe testing environment without API integration
=======
- **Gelato Integration**: Automatic product creation with multiple variants (sizes, materials, frames)
- **Real-time Status Updates**: Live progress tracking from upload to ready products
- **Demo Mode**: Safe testing environment with sandbox APIs
>>>>>>> dededd1 (Please p)
- **Scalable Architecture**: Built on Supabase with Edge Functions

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase CLI (`npm install -g supabase`)
<<<<<<< HEAD
- Shopify store with Admin API access
=======
>>>>>>> dededd1 (Please p)
- Git

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd artify-agent
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your API keys:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your actual API keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Configuration  
ANTHROPIC_API_KEY=sk-ant-your-key

<<<<<<< HEAD
# Shopify Configuration
SHOPIFY_SHOP_DOMAIN=your-shop-name.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your-access-token
=======
# Gelato Configuration
GELATO_API_KEY=your-gelato-api-key
GELATO_STORE_ID=your-store-id
>>>>>>> dededd1 (Please p)

# Demo Mode
DEMO_MODE=true
```

<<<<<<< HEAD
### 3. Set Up Shopify Private App

1. Go to your Shopify Admin → Apps → App and sales channel settings
2. Click "Develop apps" → "Create an app"
3. Configure Admin API access with these permissions:
   - Products: `read_products`, `write_products`
   - Product listings: `read_product_listings`, `write_product_listings` (optional)
4. Install the app and copy the Admin API access token

### 4. Set Up Supabase Database
=======
### 3. Set Up Supabase Database
>>>>>>> dededd1 (Please p)

```bash
# Initialize Supabase (if not already done)
supabase init

# Start local Supabase stack
supabase start

# Apply database migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy orchestrator
```

<<<<<<< HEAD
### 5. Run the Application
=======
### 4. Run the Application
>>>>>>> dededd1 (Please p)

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

## 🏗️ Architecture Overview

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
<<<<<<< HEAD
│   Next.js   │    │   Supabase   │    │   Shopify   │
│  Frontend   │◄──►│ Edge Function│◄──►│  Admin API  │
=======
│   Next.js   │    │   Supabase   │    │   Gelato    │
│  Frontend   │◄──►│ Edge Function│◄──►│     API     │
>>>>>>> dededd1 (Please p)
│             │    │              │    │             │
└─────────────┘    └──────────────┘    └─────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │  PostgreSQL  │
                   │  + RLS       │
                   └──────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │  Claude AI   │
                   │ (Metadata)   │
                   └──────────────┘
```

## 🎯 Demo Mode

The system starts in **Demo Mode** which:

- Creates **2 variants only** (A4, 50×70cm premium paper, no frame)
<<<<<<< HEAD
- Uses **local database only** (no Shopify integration)
- Provides **instant response** without external API calls
- Perfect for testing the UI and workflow
=======
- Uses **Gelato Sandbox** environment (no real printing costs)
- Skips marketplace publishing (Shopify/Etsy)
- Provides **30-second target** from upload to ready product
>>>>>>> dededd1 (Please p)

### Switching to Production Mode

Set `DEMO_MODE=false` in your environment variables to enable:

<<<<<<< HEAD
- **20+ product variants** across all size/material/frame combinations
- **Shopify Admin API integration** for real product creation
- **Full e-commerce workflow** with live store products
=======
- **20-30 product variants** across all size/material/frame combinations
- **Production Gelato API** for real product creation
- **Marketplace integration** (Shopify/Etsy publishing)
>>>>>>> dededd1 (Please p)

## 📁 Project Structure

```
artify-agent/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (proxy to Supabase)
│   ├── layout.tsx         # App layout
│   ├── page.tsx           # Main upload interface
│   └── globals.css        # Global styles
├── supabase/              # Supabase configuration
│   ├── functions/         # Edge Functions
│   │   └── orchestrator/  # Main automation logic
│   └── migrations/        # Database schema
├── docs/                  # Technical documentation
<<<<<<< HEAD
=======
│   ├── gelato-api-reference.md
│   └── # AI‑Agent × Gelato – Technical Spe.md
>>>>>>> dededd1 (Please p)
└── package.json           # Dependencies
```

## 🔧 API Endpoints

### Frontend API Routes

- `POST /api/orchestrator` - Start product creation workflow
- `GET /api/products/[id]` - Get product status for polling

### Supabase Edge Functions

- `POST /functions/v1/orchestrator` - Main automation orchestrator

## 📊 Database Schema

Key tables:

- **`image_upload`** - Stores uploaded artwork files
<<<<<<< HEAD
- **`product`** - Product records with status tracking and Shopify ID
- **`variant`** - Individual product variants (size/material/frame/price/SKU)
=======
- **`product`** - Product records with status tracking
- **`variant`** - Individual product variants (size/material/frame)
>>>>>>> dededd1 (Please p)
- **`log`** - System logs and error tracking

All tables include Row-Level Security (RLS) for user isolation.

## 🔄 Workflow Overview

1. **Upload & Validate** - Accept artwork (JPG/PNG/TIFF/PDF ≤300MB)
2. **Store & Generate URL** - Save to storage, create public URL
3. **AI Metadata Generation** - Claude creates title, description, tags
<<<<<<< HEAD
4. **Variant Creation** - Generate size × material × frame combinations with pricing
5. **Shopify Integration** - Create product with all variants via Admin API
6. **Status Polling** - Monitor progress until ready (instant in demo mode)
7. **User Notification** - Real-time status updates
=======
4. **Variant Creation** - Generate size × material × frame combinations
5. **Gelato Integration** - Create product with all variants
6. **Status Polling** - Monitor progress until ready (30-50s target)
7. **Marketplace Publishing** - Optional sync to Shopify/Etsy
8. **User Notification** - Real-time status updates
>>>>>>> dededd1 (Please p)

## 🛡️ Security Features

- **Row-Level Security (RLS)** on all database tables
- **JWT-based authentication** via Supabase Auth
- **API key management** through environment variables
- **Rate limiting** and error handling
- **Input validation** and file type restrictions

## 🔍 Monitoring & Debugging

### View Logs

```bash
# Supabase Edge Function logs
supabase functions logs orchestrator

# Database logs
SELECT * FROM log ORDER BY logged_at DESC LIMIT 50;
```

### Health Checks

- Database: `SELECT 1` query to PostgreSQL
- Edge Function: `GET /functions/v1/orchestrator` health endpoint
<<<<<<< HEAD
- Shopify API: Test connection with shop info endpoint
=======
- Gelato API: Template fetch with valid API key
>>>>>>> dededd1 (Please p)

## 🚀 Deployment

### Supabase Edge Functions

```bash
# Deploy to production
supabase functions deploy orchestrator --project-ref your-project-ref

# Set environment variables
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
<<<<<<< HEAD
supabase secrets set SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
supabase secrets set SHOPIFY_ACCESS_TOKEN=shpat_...
=======
supabase secrets set GELATO_API_KEY=your-key
>>>>>>> dededd1 (Please p)
```

### Frontend (Vercel/Netlify)

1. Connect repository to deployment platform
2. Set environment variables in platform dashboard
3. Deploy main branch

## 📈 Performance Targets

<<<<<<< HEAD
- **Upload to Ready**: ≤ 30 seconds (instant in demo mode)
- **Variant Coverage**: 100% of defined size/material/frame combinations
- **Success Rate**: > 99% for valid uploads
- **Error Recovery**: Automatic retries with exponential backoff

## 🛍️ Shopify Product Structure

Each uploaded artwork creates a single Shopify product with multiple variants:

- **Product Options**: Size, Material, Frame
- **Variants**: Every combination of options with individual SKUs and prices
- **Images**: Uploaded artwork as the main product image
- **Metadata**: AI-generated title, description, and tags
- **Inventory**: Managed via Shopify's inventory system

### Example Variants Created:
- A4 Premium Paper (No Frame) - $29.99
- A3 Premium Paper (Black Frame) - $79.99
- 50x70cm Canvas (No Frame) - $69.99
- And many more...

=======
- **Upload to Ready**: ≤ 60 seconds (30s in demo mode)
- **Variant Coverage**: 100% of template combinations
- **Success Rate**: > 99% for valid uploads
- **Error Recovery**: Automatic retries with exponential backoff

>>>>>>> dededd1 (Please p)
## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Technical Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

---

<<<<<<< HEAD
**Built with ❤️ using Supabase, Next.js, Shopify Admin API, and Claude AI** 
=======
**Built with ❤️ using Supabase, Next.js, and Claude AI** 
>>>>>>> dededd1 (Please p)
