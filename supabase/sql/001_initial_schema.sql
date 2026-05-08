create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.admin_users is
  'Fuente de autorizacion admin para el panel y las politicas RLS.';

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12,2) not null check (price >= 0),
  availability text not null default 'available'
    check (availability in ('available', 'inquiry', 'out_of_stock', 'hidden')),
  is_active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_message text,
  total numeric(12,2) not null default 0 check (total >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'ready_for_pickup', 'completed', 'cancelled')),
  whatsapp_message text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity int not null check (quantity > 0),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  whatsapp_phone text not null,
  instagram_url text,
  address text,
  opening_hours text,
  checkout_message text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_categories_active on public.categories(is_active);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_active on public.products(is_active, availability);
create index if not exists idx_products_featured on public.products(featured);
create index if not exists idx_product_images_product on public.product_images(product_id, sort_order);
create index if not exists idx_orders_status_created_at on public.orders(status, created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);

drop trigger if exists trg_admin_users_updated_at on public.admin_users;
create trigger trg_admin_users_updated_at
before update on public.admin_users
for each row
execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists trg_store_settings_updated_at on public.store_settings;
create trigger trg_store_settings_updated_at
before update on public.store_settings
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
      and is_active = true
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.create_order_with_items(
  p_order_code text,
  p_customer_name text,
  p_customer_phone text,
  p_customer_message text default null,
  p_whatsapp_message text default null,
  p_items jsonb default '[]'::jsonb
)
returns table (
  order_id uuid,
  order_code text,
  total numeric,
  whatsapp_message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_quantity integer;
  v_subtotal numeric(12,2);
begin
  p_order_code := trim(coalesce(p_order_code, ''));
  p_customer_name := trim(coalesce(p_customer_name, ''));
  p_customer_phone := trim(coalesce(p_customer_phone, ''));
  p_customer_message := nullif(trim(coalesce(p_customer_message, '')), '');
  p_whatsapp_message := nullif(trim(coalesce(p_whatsapp_message, '')), '');

  if length(p_order_code) < 8 then
    raise exception 'Codigo de pedido invalido.';
  end if;

  if length(p_customer_name) < 2 then
    raise exception 'Nombre invalido.';
  end if;

  if length(p_customer_phone) < 8 then
    raise exception 'Telefono invalido.';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'El pedido debe incluir al menos un item.';
  end if;

  insert into public.orders (
    id,
    order_code,
    customer_name,
    customer_phone,
    customer_message,
    total,
    status,
    whatsapp_message
  ) values (
    v_order_id,
    p_order_code,
    p_customer_name,
    p_customer_phone,
    p_customer_message,
    0,
    'pending',
    p_whatsapp_message
  );

  for v_item in
    select value
    from jsonb_array_elements(p_items) as value
  loop
    v_quantity := (v_item ->> 'quantity')::integer;

    if v_quantity is null or v_quantity < 1 or v_quantity > 99 then
      raise exception 'Cantidad invalida en el pedido.';
    end if;

    select *
      into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid
      and is_active = true
      and availability <> 'hidden';

    if not found then
      raise exception 'Uno de los productos no esta disponible para la venta.';
    end if;

    v_subtotal := round((v_product.price * v_quantity)::numeric, 2);
    v_total := round((v_total + v_subtotal)::numeric, 2);

    insert into public.order_items (
      order_id,
      product_id,
      product_name,
      unit_price,
      quantity,
      subtotal
    ) values (
      v_order_id,
      v_product.id,
      v_product.name,
      v_product.price,
      v_quantity,
      v_subtotal
    );
  end loop;

  update public.orders
  set total = v_total
  where id = v_order_id;

  return query
  select v_order_id, p_order_code, v_total, p_whatsapp_message;
exception
  when unique_violation then
    raise exception 'El codigo de pedido ya existe. Reintenta la operacion.';
end;
$$;

grant execute on function public.create_order_with_items(
  text,
  text,
  text,
  text,
  text,
  jsonb
) to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "Admin self or admins can read admin_users" on public.admin_users;
create policy "Admin self or admins can read admin_users"
on public.admin_users
for select
using (public.is_admin() or auth.uid() = id);

drop policy if exists "Admins can manage admin_users" on public.admin_users;
create policy "Admins can manage admin_users"
on public.admin_users
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories"
on public.categories
for select
using (is_active = true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (is_active = true and availability <> 'hidden');

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read visible product_images" on public.product_images;
create policy "Public can read visible product_images"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.is_active = true
      and products.availability <> 'hidden'
  )
);

drop policy if exists "Admins can manage product_images" on public.product_images;
create policy "Admins can manage product_images"
on public.product_images
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read store settings" on public.store_settings;
create policy "Public can read store settings"
on public.store_settings
for select
using (true);

drop policy if exists "Admins can manage store settings" on public.store_settings;
create policy "Admins can manage store settings"
on public.store_settings
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders"
on public.orders
for select
using (public.is_admin());

drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders"
on public.orders
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read order_items" on public.order_items;
create policy "Admins can read order_items"
on public.order_items
for select
using (public.is_admin());

drop policy if exists "Admins can manage order_items" on public.order_items;
create policy "Admins can manage order_items"
on public.order_items
for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can read product images bucket" on storage.objects;
create policy "Public can read product images bucket"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects
for insert
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects
for update
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects
for delete
using (bucket_id = 'product-images' and public.is_admin());
