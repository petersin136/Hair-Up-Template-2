-- Hair up — OUR SERVICES (admin-editable later)
-- Run in Supabase SQL Editor.

-- 1) Categories
create table if not exists public.service_categories (
  id          text primary key,          -- e.g. 'cut', 'perm', 'color', 'clinic'
  label       text not null,             -- display: 'CUT', 'PERM', ...
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2) Service items
create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  category_id  text not null references public.service_categories(id) on delete cascade,
  name         text not null,
  price        int  not null,            -- KRW, no commas
  sort_order   int  not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists services_category_sort_idx
  on public.services (category_id, sort_order);

-- 3) Public read (admin write comes later via authenticated policies)
alter table public.service_categories enable row level security;
alter table public.services enable row level security;

drop policy if exists "Public read service_categories" on public.service_categories;
create policy "Public read service_categories"
  on public.service_categories for select
  to public using (true);

drop policy if exists "Public read services" on public.services;
create policy "Public read services"
  on public.services for select
  to public using (is_active = true);

-- 4) Seed categories
insert into public.service_categories (id, label, sort_order) values
  ('cut',    'CUT',           1),
  ('perm',   'PERM',          2),
  ('color',  'COLOR',         3),
  ('clinic', 'CLINIC & CARE', 4)
on conflict (id) do update
  set label = excluded.label,
      sort_order = excluded.sort_order,
      updated_at = now();

-- 5) Seed services (idempotent by wiping then re-inserting seed set)
delete from public.services;

insert into public.services (category_id, name, price, sort_order) values
  ('cut',    '컷',                                 25000,  1),
  ('cut',    '시그니처 레이어드 / 디자인 컷',       35000,  2),
  ('cut',    '맨즈 디자인 컷 (+ 다운펌 패키지)',    60000,  3),
  ('perm',   '디자인 일반펌',                       90000,  1),
  ('perm',   '셋팅 / 디지털 열펌',                 160000,  2),
  ('perm',   '시그니처 볼륨매직 / 매직셋팅',       200000,  3),
  ('color',  '베이직 전체 컬러',                   100000,  1),
  ('color',  '프리미엄 케어 컬러',                 140000,  2),
  ('color',  '디자인 탈색 / 발레아쥬 (1회 기준)',  150000,  3),
  ('clinic', '수분 단백질 집중 케어',               80000,  1),
  ('clinic', '프리미엄 모발 재생 클리닉',          150000,  2),
  ('clinic', '스칼프 두피 스파 케어',               70000,  3);
