-- AI-Agent × Gelato Database Schema
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create tables
create table public.image_upload (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  checksum    text,
  filename    text,
  size_bytes  bigint,
  content_type text,
  created_at  timestamptz default now(),
  user_id     uuid references auth.users(id)
);

create table public.product (
  id           uuid primary key default gen_random_uuid(),
  gelato_id    text unique,
  shopify_id   text,
  etsy_id      text,
  status       text default 'PROCESSING' check (status in ('PROCESSING', 'READY', 'ERROR', 'DELETED')),
  title        text,
  description  text,
  tags         text[],
  image_upload_id uuid references public.image_upload(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  user_id      uuid references auth.users(id)
);

create table public.variant (
  id                  uuid primary key default gen_random_uuid(),
  product_id          uuid references public.product(id) on delete cascade,
  template_variant_id text not null,
  sku                 text,
  material            text,
  size                text,
  frame               text,
  price_cents         integer,
  mockup_url          text,
  status              text default 'PROCESSING' check (status in ('PROCESSING', 'READY', 'ERROR')),
  created_at          timestamptz default now()
);

create table public.log (
  id        bigint generated always as identity primary key,
  level     text check (level in ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL')),
  context   jsonb,
  message   text not null,
  product_id uuid references public.product(id),
  logged_at timestamptz default now()
);

-- Create indexes for performance
create index idx_product_status on public.product(status);
create index idx_product_user_id on public.product(user_id);
create index idx_variant_product_id on public.variant(product_id);
create index idx_log_product_id on public.log(product_id);
create index idx_log_logged_at on public.log(logged_at);

-- Enable Row Level Security
alter table public.image_upload enable row level security;
alter table public.product enable row level security;
alter table public.variant enable row level security;
alter table public.log enable row level security;

-- RLS Policies
-- Image uploads: users can only access their own uploads
create policy "Users can insert their own image uploads" on public.image_upload
  for insert with check (auth.uid() = user_id);

create policy "Users can view their own image uploads" on public.image_upload
  for select using (auth.uid() = user_id);

-- Products: users can only access their own products
create policy "Users can insert their own products" on public.product
  for insert with check (auth.uid() = user_id);

create policy "Users can view their own products" on public.product
  for select using (auth.uid() = user_id);

create policy "Users can update their own products" on public.product
  for update using (auth.uid() = user_id);

-- Variants: users can only access variants of their own products
create policy "Users can view variants of their own products" on public.variant
  for select using (
    exists (
      select 1 from public.product 
      where product.id = variant.product_id 
      and product.user_id = auth.uid()
    )
  );

create policy "Users can insert variants for their own products" on public.variant
  for insert with check (
    exists (
      select 1 from public.product 
      where product.id = variant.product_id 
      and product.user_id = auth.uid()
    )
  );

-- Logs: users can view logs for their own products
create policy "Users can view logs for their own products" on public.log
  for select using (
    product_id is null or
    exists (
      select 1 from public.product 
      where product.id = log.product_id 
      and product.user_id = auth.uid()
    )
  );

-- Service role can do everything (for Edge Functions)
create policy "Service role can manage all data" on public.image_upload
  for all using (auth.jwt() ->> 'role' = 'service_role');

create policy "Service role can manage all products" on public.product
  for all using (auth.jwt() ->> 'role' = 'service_role');

create policy "Service role can manage all variants" on public.variant
  for all using (auth.jwt() ->> 'role' = 'service_role');

create policy "Service role can manage all logs" on public.log
  for all using (auth.jwt() ->> 'role' = 'service_role');

-- Functions for updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for product updated_at
create trigger update_product_updated_at
  before update on public.product
  for each row execute function public.update_updated_at_column();

-- Demo mode cleanup function (for nightly truncate)
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