# AI‑Agent × Gelato – Technical Specification  (🎯 **Supabase Edition**)

> **Goal:** Automate the entire product‑creation pipeline for a Gelato‑powered poster store: user drops in a single artwork file; the agent generates every size × material × frame variant, pushes them to Gelato, and (optionally) syncs to Shopify/Etsy – completely hands‑off.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Workflow in Detail](#workflow-in-detail)
4. [Data Model](#data-model)
5. [Gelato API Integration](#gelato-api-integration)
6. [AI‑Agent Responsibilities](#ai-agent-responsibilities)
7. [Best Practices](#best-practices)
8. [Error Handling & Retries](#error-handling--retries)
9. [Security & Compliance](#security--compliance)
10. [Deployment & Ops](#deployment--ops)
11. [Future Extensions](#future-extensions)
12. [Appendix A – Sample Code](#appendix-a)

---

## 1  Project Overview

| Item               | Description                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| **Problem**        | Manual creation of 20‑30 product variants per upload is slow and error‑prone.                             |
| **Solution**       | AI‑driven orchestrator collects artwork, invokes Gelato template, creates all variants, and reports back. |
| **Success Metric** | ≤ 60 s from upload ➜ live product with 100 % variant coverage.                                            |
| **Stakeholders**   | • Store Owner (William)  • Dev/AI Team  • End‑users                                                       |

---

## Demo Mode (Proof of Concept)

| Aspect                 | Demo‑specific Choice                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| **Purpose**            | Show end‑to‑end flow without touching real production systems or charging customers.              |
| **Variant Scope**      | 1 material (premium paper) × 2 sizes (A4, 50×70 cm) × no frame – keeps mock‑ups fast.             |
| **Gelato Environment** | Use **Gelato Sandbox** API key – no live printing costs.                                          |
| **Publishing**         | Skip Shopify/Etsy; display JSON response + Gelato dashboard link only.                            |
| **Database**           | Supabase *free tier* project; no RLS, single service‑role. Nightly truncate via Edge Scheduler.   |
| **AI Model**           | **Claude 3 Haiku** (temperature 0) – lowest cost; static price multiplier (2.0× production cost). |
| **Trigger**            | Manual button in admin UI (`/demo-upload`) uploads file and streams status logs.                  |
| **Success Metric**     | Product with both demo variants appears in Gelato Sandbox dashboard ≤ 30 s.                       |
| **Cleanup**            | Edge Fn cron (daily) deletes sandbox products and empties Supabase tables.                        |

> **Note:** All other sections in this document describe the **Full Production** flow. The demo mode is a slimmed‑down configuration that re‑uses 90 % of the same code, just with feature flags disabled.

---

## 2  System Architecture

```mermaid
flowchart TD
    User -->|Artwork| WebApp
    WebApp -->|Webhook| Orchestrator[AI‑Orchestrator (Edge Fn / Lambda + Claude/Haiku)]
    Orchestrator -->|REST| GelatoAPI
    Orchestrator -->|GraphQL / REST| ShopifyAPI
    Orchestrator -->|supabase‑js| Supabase[(Postgres + RLS)]
    Orchestrator -->|Events| Notification(Channel)
```

* **WebApp** – drag‑and‑drop UI, collects file, shows status.
* **Orchestrator** – Supabase Edge Function **eller** AWS Lambda (Node 20) som kjører agentlogikken.
* **AI Layer** – Claude 3 Sonnet/Haiku (tool‑use) genererer metadata & API‑payloads.
* **Persistent Store** – Supabase‑hostet PostgreSQL med Row‑Level Security (RLS).
* **Notification** – Slack, Email eller Realtime-subscription (Supabase) som oppdaterer frontend.

---

## 3  Workflow in Detail

1. **Upload & Validate**  
      ‣ Accept `jpg|png|tiff|pdf` ≤ 300 MB  
      ‣ Enforce min 300 DPI for largest print.
2. **Store & Generate URL**  
      ‣ Push to S3/Cloudinary ➜ obtain `publicUrl` (or Supabase Storage if preferred).
3. **Fetch Template Meta (cached)**  
      ‣ `GET /v3/templates/{templateId}` ➜ cache 30 min to Supabase KV.
4. **Map Variants**  
      ‣ material × size × frame ➜ `templateVariantId` lookup  
      ‣ Build variant array.
5. **Create Product & Pass Image to Gelato**  
      Gelato **pulls** the image from the `fileUrl` provided in `imagePlaceholders` (HTTPS, public for ≥ 2 h).

```json
{
  "storeId": "<uuid>",
  "templateId": "<uuid>",
  "imagePlaceholders": [{
    "name": "ImageFront",
    "fileUrl": "https://cdn.example.com/art.jpg"
  }],
  "variants": [{ "templateVariantId": "…" }]
}
```

6. **Poll Status** – `GET /v3/products/{id}` until `READY`.
7. **Enrich & Publish** – Claude 3 Sonnet creates title, SEO description, tags ➜ push to Shopify/Etsy.
8. **Notify User** – Supabase Realtime channel or webhook.

*Total latency:* 30‑50 s.

---

## 4  Data Model  (Supabase schema)

```sql
create table public.image_upload (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  checksum    text,
  created_at  timestamptz default now(),
  user_id     uuid references auth.users(id)
);

create table public.product (
  id           uuid primary key default gen_random_uuid(),
  gelato_id    text,
  shopify_id   text,
  status       text,
  title        text,
  created_at   timestamptz default now(),
  user_id      uuid references auth.users(id)
);

create table public.variant (
  id                  uuid primary key default gen_random_uuid(),
  product_id          uuid references public.product(id) on delete cascade,
  template_variant_id text,
  sku                 text,
  material            text,
  size                text,
  frame               text
);

create table public.log (
  id        bigint generated always as identity primary key,
  level     text,
  context   jsonb,
  message   text,
  logged_at timestamptz default now()
);
```

**Row‑Level Security (RLS) sample**

```sql
alter table public.product enable row level security;
create policy "User‑owns‑row" on public.product
  for select using ( auth.uid() = user_id );
```

---

## 5  Gelato API Integration

### 5.1 Authentication

```http
X-API-KEY: <GELATO_API_KEY>
```

Store the key in **Supabase Secrets** (`supabase secrets set`) or in AWS Secrets Manager if running Lambda.

### 5.2 Endpoints Used

| Purpose        | Method & Path                     | Notes                              |
| -------------- | --------------------------------- | ---------------------------------- |
| Fetch Template | `GET /v3/templates/{id}`          | includes `templateVariantId` array |
| Create Product | `POST /v3/products-from-template` | see JSON above                     |
| Get Product    | `GET /v3/products/{id}`           | poll until `READY`                 |

*All calls are idempotent via `Idempotency-Key` header.*

---

## 6  AI‑Agent Responsibilities

1. Translate natural‑language instructions ⇄ structured JSON (*tool‑use*).
2. Generate product metadata (multi‑locale).
3. Calculate margin‑aware pricing.
4. Emit structured logs + errors to Supabase.

---

## 7  Best Practices

* **Template discipline** – single canonical Gelato template.
* **Placeholder naming** – `ImageFront` everywhere.
* **Caching** – Supabase KV or Edge Function global cache.
* **Retry jitter** – exponential back‑off max 5 attempts.
* **Observability** – Supabase logs + OpenTelemetry traces.
* **RLS tests** – ensure users can only see own products.

---

## 8  Error Handling & Retries

| Failure Case         | Strategy                                               |
| -------------------- | ------------------------------------------------------ |
| 4xx from Gelato      | Abort, surface plaintext error to UI, flag upload row. |
| 5xx / Timeout        | Retry ≤ 5× with jitter.                                |
| Missing Variant      | Log critical, skip that variant, continue.             |
| Shopify publish fail | Push to `retry_queue`, attempt hourly Edge Job.        |

---

## 9  Security & Compliance

* **RLS & JWT** – Supabase handles auth; every table has user‑scoped policy.
* **Least privilege** – Edge Function service‑role key only server‑side.
* **GDPR** – `/delete-account` triggers cascade delete + S3 purge.
* **Rate limits** – respect Gelato 600 RPM; clamp concurrency in Edge Fn.

---

## 10  Deployment & Ops

| Component    | Runtime / Host                         | Deploy                                       |
| ------------ | -------------------------------------- | -------------------------------------------- |
| Orchestrator | **Supabase Edge Function (Node 20)**   | GitHub Actions ➜ `supabase functions deploy` |
| Database     | **Supabase Postgres (managed)**        | `supabase db push` (SQL migrations)          |
| Frontend     | Next.js 14 (Vercel)                    | –                                            |
| Monitoring   | Supabase Observability + Sentry Edge   | –                                            |

*Blue‑green Edge releases: preview ➜ promote; auto‑rollback on p95 latency > 20 %.*

---

## 11  Future Extensions

* Supabase Storage as primary image repo (signed URLs).
* Supabase Vectors for image‑similarity powered search.
* GraphQL subscriptions for live order state.
* Supabase Edge Scheduler for timed product launches.

---

## 12  Appendix A

### A.1  End‑to‑end Pseudocode (Edge Function + Claude)

```js
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { getTemplate, createProduct, waitUntilReady } from './gelato.js';

export const handler = async (event, context) => {
  const file = event.body.file; // presigned upload already done client‑side

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const fileUrl = file.publicUrl; // retrieved from client metadata
  const template = await getTemplate();

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const { tool } = await anthropic.messages.create({
    model: 'claude-3-sonnet-2025-02-29',
    temperature: 0.1,
    tools: [ /* createGelatoProduct schema … */ ],
    messages: [
      {
        role: 'user',
        content: `Map variants from template JSON and build arguments.\nTemplate: ${JSON.stringify(template)}\nURL: ${fileUrl}`,
      },
    ],
  });

  const product = await createProduct(tool.arguments);
  await waitUntilReady(product.id);

  await supabase.from('product').insert({
    gelato_id: product.id,
    status: product.status,
    title: product.title,
    user_id: context.user.id,
  });

  return new Response(JSON.stringify({ success: true, productId: product.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### A.2  Supabase Insert Snippet

```js
await supabase
  .from('variant')
  .insert(
    variants.map(v => ({
      product_id: productId,
      template_variant_id: v.templateVariantId,
      material: v.material,
      size: v.size,
      frame: v.frame,
    }))
  );
```

### A.3  cURL Example (unchanged)

```bash
curl -X POST https://api.gelato.com/v3/products-from-template \
  -H "X-API-KEY: $GELATO_API_KEY" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "123e4567-e89b-12d3-a456-426614174000",
    "templateId": "tmpl_789...",
    "imagePlaceholders": [{"name":"ImageFront","fileUrl":"https://cdn.example.com/myart.jpg"}],
    "variants": [{"templateVariantId":"var_001"}, {"templateVariantId":"var_002"}]
  }'
```

---

### A.4  One‑shot “Lovable” Prototype Script

> *Goal: spin up the entire **Demo Mode** locally with one command so you can test the flow inside the Lovable IDE (or any local environment).*
> **Prerequisites:** Node ≥ 20, Docker, Supabase CLI (`npm i -g supabase`), and Git installed.

```bash
# 1. Scaffold demo repo
npx degit william/gelato-prototype lovable-demo
cd lovable-demo

# 2. Configure environment variables
cp .env.example .env
# 👉  Edit .env and add your SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, GELATO_SANDBOX_KEY

# 3. Start local Supabase stack (Postgres + Auth + Storage)
supabase start

# 4. Push database schema & run migrations
supabase db push

# 5. Deploy the Edge Function (demo flag on)
supabase functions deploy orchestrator --project-ref $SUPABASE_REF \
  --import-map=./supabase/import_map.json

# 6. Smoke‑test: invoke function with dummy file URL
supabase functions invoke orchestrator --local \
  --body '{"file":{"publicUrl":"https://cdn.example.com/demo-art.jpg"}}'
```

**What the script does**

1. Clones a minimal prototype repo (`william/gelato-prototype`).
2. Copies example environment file; you paste in keys.
3. Boots Supabase locally via Docker.
4. Applies the Supabase schema defined in the spec (ImageUpload, Product, Variant, Log).
5. Deploys the *orchestrator* Edge Function preconfigured for Demo Mode (Haiku, Gelato Sandbox, limited variants).
6. Invokes the function once so you can verify the JSON response and check the product in Gelato Sandbox.

> Replace `demo-art.jpg` with a publicly accessible test image URL. If all goes well, you’ll see `{ "success": true, "productId": "prod_demo_…" }` and the item in Gelato Sandbox.
