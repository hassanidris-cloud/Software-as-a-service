-- LoyaltyHub MVP schema
-- Tables: profiles, businesses, products, loyalty_cards

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text,
  logo_url text,
  city text,
  country text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.loyalty_cards (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  points integer not null default 0 check (points >= 0),
  qr_token uuid not null default gen_random_uuid() unique,
  last_scanned_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (customer_id, business_id)
);

create index if not exists idx_businesses_owner_id on public.businesses (owner_id);
create index if not exists idx_products_business_id on public.products (business_id);
create index if not exists idx_loyalty_cards_business_id on public.loyalty_cards (business_id);
create index if not exists idx_loyalty_cards_customer_id on public.loyalty_cards (customer_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_businesses_updated_at on public.businesses;
create trigger trg_businesses_updated_at
before update on public.businesses
for each row
execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists trg_loyalty_cards_updated_at on public.loyalty_cards;
create trigger trg_loyalty_cards_updated_at
before update on public.loyalty_cards
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.products enable row level security;
alter table public.loyalty_cards enable row level security;

-- Profiles: users manage only their own account row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Businesses: only owners can create/manage; everyone authenticated can see active businesses.
drop policy if exists "businesses_select_active_or_owned" on public.businesses;
create policy "businesses_select_active_or_owned"
on public.businesses
for select
using (is_active = true or owner_id = auth.uid());

drop policy if exists "businesses_insert_owned" on public.businesses;
create policy "businesses_insert_owned"
on public.businesses
for insert
with check (owner_id = auth.uid());

drop policy if exists "businesses_update_owned" on public.businesses;
create policy "businesses_update_owned"
on public.businesses
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "businesses_delete_owned" on public.businesses;
create policy "businesses_delete_owned"
on public.businesses
for delete
using (owner_id = auth.uid());

-- Products: visible if business is active; owners can manage their own product catalog.
drop policy if exists "products_select_active_or_owned" on public.products;
create policy "products_select_active_or_owned"
on public.products
for select
using (
  exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and (b.is_active = true or b.owner_id = auth.uid())
  )
);

drop policy if exists "products_insert_owned_business" on public.products;
create policy "products_insert_owned_business"
on public.products
for insert
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and b.owner_id = auth.uid()
  )
);

drop policy if exists "products_update_owned_business" on public.products;
create policy "products_update_owned_business"
on public.products
for update
using (
  exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and b.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and b.owner_id = auth.uid()
  )
);

drop policy if exists "products_delete_owned_business" on public.products;
create policy "products_delete_owned_business"
on public.products
for delete
using (
  exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and b.owner_id = auth.uid()
  )
);

-- Loyalty cards: card holder and business owner can view;
-- only business owner can increment/update points.
drop policy if exists "loyalty_cards_select_customer_or_owner" on public.loyalty_cards;
create policy "loyalty_cards_select_customer_or_owner"
on public.loyalty_cards
for select
using (
  customer_id = auth.uid()
  or exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and b.owner_id = auth.uid()
  )
);

drop policy if exists "loyalty_cards_insert_customer_or_owner" on public.loyalty_cards;
create policy "loyalty_cards_insert_customer_or_owner"
on public.loyalty_cards
for insert
with check (
  customer_id = auth.uid()
  or exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and b.owner_id = auth.uid()
  )
);

drop policy if exists "loyalty_cards_update_owner_only" on public.loyalty_cards;
create policy "loyalty_cards_update_owner_only"
on public.loyalty_cards
for update
using (
  exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and b.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = business_id
      and b.owner_id = auth.uid()
  )
);
