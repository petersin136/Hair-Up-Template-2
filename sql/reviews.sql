-- Hair up — REVIEW carousel + Instagram strip
-- Run in Supabase SQL Editor

create table if not exists public.reviews (
  id             uuid primary key default gen_random_uuid(),
  artist_name    text not null,
  service_label  text not null,
  body           text not null,
  rating         int  not null default 5 check (rating between 1 and 5),
  reviewer_mask  text not null,
  reviewed_on    text not null, -- display e.g. 26-06-28
  image_url      text not null,
  sort_order     int  not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.instagram_posts (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,
  alt         text,
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.reviews enable row level security;
alter table public.instagram_posts enable row level security;

drop policy if exists "Public read reviews" on public.reviews;
create policy "Public read reviews"
  on public.reviews for select
  using (is_active = true);

drop policy if exists "Public read instagram_posts" on public.instagram_posts;
create policy "Public read instagram_posts"
  on public.instagram_posts for select
  using (is_active = true);

-- Seed reviews (3 designers). Replace image_url after uploading final assets.
delete from public.reviews;
insert into public.reviews
  (artist_name, service_label, body, rating, reviewer_mask, reviewed_on, image_url, sort_order)
values
(
  '미나',
  'DESIGNER CUT & SCALP HEAD SPA',
  '처음 방문했는데 유미 디렉터님의 섬세한 터치와 1:1 맞춤 상담이 인상 깊었습니다. 특히 프라이빗한 샴푸실에서 진행된 두피 스파 케어는 일상의 피로가 모두 녹아내리는 최고의 힐링이었습니다. 커트 선 하나하나 세심하게 신경 써주셔서 손질하기가 아주 편합니다.',
  5,
  'pp*****',
  '26-06-28',
  'https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images/rafaella-mendes-diniz-et_78QkMMQs-unsplash2.jpg',
  1
),
(
  '준우',
  'SIGNATURE PERM',
  '살롱 무드가 고급스럽고, 모질과 얼굴형에 맞춘 스타일 제안이 정확했습니다. 손상 없이 자연스럽게 살아나는 컬 라인이 특히 마음에 들어요. 시술 후에도 손질이 편해서 만족도가 높습니다.',
  4,
  'MM*****',
  '26-06-28',
  'https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images/tengyart-wpRfk1NT6Ng-unsplash.jpg',
  2
),
(
  '소라',
  'PREMIUM COLOR & CLINIC',
  '전체 염색과 클리닉을 함께 진행했는데, 모발 손상 없이 오히려 머릿결이 이전보다 더 단단하고 윤기 있게 개선되어 놀랐습니다. 퍼스널 컬러에 맞춘 정교한 톤 매칭부터 시술 중간중간 세심하게 챙겨주시는 배려까지, 프로페셔널함의 격이 다른 곳입니다.',
  4,
  'BR*****',
  '26-06-28',
  'https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images/happy-face-emoji-ShBsiIbYJmY-unsplash.jpg',
  3
);

delete from public.instagram_posts;
insert into public.instagram_posts (image_url, alt, sort_order) values
(
  'https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images/katsiaryna-endruszkiewicz-yZviQtYoP08-unsplash2.jpg',
  'Hair in motion',
  1
),
(
  'https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images/rafaella-mendes-diniz-et_78QkMMQs-unsplash2.jpg',
  'Signature hair portrait',
  2
),
(
  'https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images/megan-bagshaw-YmaaUNbHHtw-unsplash.jpg',
  'Men''s cut profile',
  3
),
(
  'https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images/happy-face-emoji-ShBsiIbYJmY-unsplash.jpg',
  'Editorial color portrait',
  4
),
(
  'https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images/igor-rand-sY3CosjuaXw-unsplash2.jpg',
  'Close-up portrait',
  5
);
