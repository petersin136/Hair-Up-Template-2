-- Hair up — BOOKING (UI + Supabase save, payment later)
-- Run in Supabase SQL Editor after services.sql

-- 1) Designers
create table if not exists public.designers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2) Booking settings (singleton)
create table if not exists public.booking_settings (
  id              int primary key default 1 check (id = 1),
  deposit_rate    numeric(5,4) not null default 0.2000,  -- 20%
  deposit_min     int not null default 10000,            -- 최소 1만원
  time_slots      text[] not null default array[
    '10:00','10:30','11:00','11:30','13:00','14:00'
  ],
  privacy_terms   text not null default $terms$
수집 항목: 이름, 연락처, 예약 일시, 선택 시술, 요청사항
이용 목적: 예약 확인, 시술 준비, 노쇼 방지 및 고객 응대
보유 기간: 관련 법령에 따른 기간 또는 목적 달성 시까지
동의 거부 시 예약 서비스 이용이 제한될 수 있습니다.
$terms$,
  updated_at      timestamptz not null default now()
);

insert into public.booking_settings (id) values (1)
on conflict (id) do update
  set deposit_rate = 0.2000,
      deposit_min  = 10000,
      updated_at   = now();

-- 3) Bookings
create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  designer_id     uuid references public.designers(id),
  designer_name   text not null,
  booking_date    date not null,
  booking_time    text not null,
  customer_name   text not null,
  customer_phone  text not null,
  requests        text,
  consent         boolean not null default false,
  total_price     int  not null,
  deposit_amount  int  not null,
  status          text not null default 'pending_payment',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists bookings_date_idx on public.bookings (booking_date);

-- 4) Booking ↔ services (snapshot prices)
create table if not exists public.booking_services (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null references public.bookings(id) on delete cascade,
  service_id    uuid references public.services(id) on delete set null,
  service_name  text not null,
  price         int  not null,
  sort_order    int  not null default 0
);

create index if not exists booking_services_booking_idx
  on public.booking_services (booking_id);

-- 5) RLS
alter table public.designers enable row level security;
alter table public.booking_settings enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_services enable row level security;

drop policy if exists "Public read designers" on public.designers;
create policy "Public read designers"
  on public.designers for select to public
  using (is_active = true);

drop policy if exists "Public read booking_settings" on public.booking_settings;
create policy "Public read booking_settings"
  on public.booking_settings for select to public
  using (true);

-- Anyone can create a booking (payment comes later)
drop policy if exists "Public insert bookings" on public.bookings;
create policy "Public insert bookings"
  on public.bookings for insert to public
  with check (consent = true);

drop policy if exists "Public insert booking_services" on public.booking_services;
create policy "Public insert booking_services"
  on public.booking_services for insert to public
  with check (true);

-- No public select on bookings (privacy) — admin later

-- 6) Seed designers
delete from public.designers;
insert into public.designers (name, sort_order) values
  ('미나', 1),
  ('소라', 2),
  ('준우', 3);
