-- Mea Culpa - Esquema para Supabase (PostgreSQL)
-- Ejecutar en el SQL Editor del dashboard de Supabase

-- Perfil de usuario (se sincroniza con auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'user',
  level text not null default 'principiante',
  experience int not null default 0,
  wallet_balance int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger: crear perfil al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, wallet_balance)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', ''),
    100
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS: perfiles
alter table public.profiles enable row level security;

create policy "Usuarios ven su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuarios actualizan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Personajes (2 gratis, resto de pago)
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  class_type text,
  level int not null default 1,
  is_free_slot boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.characters enable row level security;
create policy "CRUD characters own"
  on public.characters for all using (auth.uid() = user_id);

-- Inventario
create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null,
  quantity int not null default 1,
  metadata text,
  created_at timestamptz not null default now()
);

alter table public.inventory_items enable row level security;
create policy "CRUD inventory own"
  on public.inventory_items for all using (auth.uid() = user_id);

-- Noticias
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  image_url text,
  author_id text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.news enable row level security;
create policy "News public read"
  on public.news for select using (published = true);

create table if not exists public.news_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  news_id uuid not null references public.news(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, news_id)
);

alter table public.news_subscriptions enable row level security;
create policy "CRUD news_subs own"
  on public.news_subscriptions for all using (auth.uid() = user_id);

-- Tiendas
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stores enable row level security;
create policy "Stores public read"
  on public.stores for select using (is_active = true);

create table if not exists public.store_products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  description text,
  image_url text,
  price int not null,
  stock int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.store_products enable row level security;
create policy "Products public read"
  on public.store_products for select using (
    exists (select 1 from public.stores s where s.id = store_id and s.is_active = true)
  );

-- Gremios
create table if not exists public.guilds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  max_members int not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.guilds enable row level security;
create policy "Guilds read all"
  on public.guilds for select using (true);
create policy "Guilds insert auth"
  on public.guilds for insert with check (auth.uid() is not null);
create policy "Guilds update own"
  on public.guilds for update using (
    exists (select 1 from public.guild_members m where m.guild_id = id and m.user_id = auth.uid() and m.role = 'leader')
  );

create table if not exists public.guild_members (
  id uuid primary key default gen_random_uuid(),
  guild_id uuid not null references public.guilds(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  can_access_vault boolean not null default false,
  joined_at timestamptz not null default now(),
  unique(guild_id, user_id)
);

alter table public.guild_members enable row level security;
create policy "Guild members by guild"
  on public.guild_members for all using (
    auth.uid() = user_id or
    exists (select 1 from public.guild_members m where m.guild_id = guild_members.guild_id and m.user_id = auth.uid())
  );

create table if not exists public.guild_messages (
  id uuid primary key default gen_random_uuid(),
  guild_id uuid not null references public.guilds(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.guild_messages enable row level security;
create policy "Guild messages members"
  on public.guild_messages for all using (
    exists (select 1 from public.guild_members m where m.guild_id = guild_messages.guild_id and m.user_id = auth.uid())
  );

create table if not exists public.guild_vault_items (
  id uuid primary key default gen_random_uuid(),
  guild_id uuid not null references public.guilds(id) on delete cascade,
  item_id text not null,
  quantity int not null default 1,
  added_by_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.guild_vault_items enable row level security;
create policy "Guild vault members with access"
  on public.guild_vault_items for all using (
    exists (
      select 1 from public.guild_members m
      where m.guild_id = guild_vault_items.guild_id and m.user_id = auth.uid()
      and (m.can_access_vault or m.role in ('leader', 'officer'))
    )
  );

-- Economía
create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount int not null,
  type text not null,
  reference_id text,
  created_at timestamptz not null default now()
);

alter table public.wallet_transactions enable row level security;
create policy "Wallet own"
  on public.wallet_transactions for all using (auth.uid() = user_id);

-- Políticas para admin (editar tiendas/productos): permitir si profiles.role = 'admin'
create policy "Stores update admin"
  on public.stores for update using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Products update admin"
  on public.store_products for update using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Insertar noticia y tienda de ejemplo (opcional)
insert into public.news (title, slug, content, published)
values ('Bienvenidos a Mea Culpa', 'bienvenida', 'Bienvenidos al campamento. Aquí podréis gestionar inventario, uniros a gremios y visitar las tiendas.', true)
on conflict (slug) do nothing;

insert into public.stores (name, slug, description, is_active)
values ('Tienda del Reino', 'tienda-del-reino', 'Armas, armaduras y provisiones para aventureros.', true)
on conflict (slug) do nothing;

insert into public.store_products (store_id, name, description, price, stock)
select s.id, 'Espada de acero', 'Espada básica para combate.', 50, 10
from public.stores s where s.slug = 'tienda-del-reino'
and not exists (select 1 from public.store_products p where p.store_id = s.id and p.name = 'Espada de acero');
