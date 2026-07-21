import { createClient } from "@supabase/supabase-js";

/**
 * Public project credentials (safe to expose — RLS protects writes).
 * Fallback so Vercel works even if Project → Environment Variables
 * were not configured yet. Prefer setting NEXT_PUBLIC_* on Vercel.
 */
const SUPABASE_URL_FALLBACK = "https://ydjzhldfwuqbtukenfbm.supabase.co";
const SUPABASE_ANON_KEY_FALLBACK =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkanpobGRmd3VxYnR1a2VuZmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NDQwNTUsImV4cCI6MjEwMDEyMDA1NX0.iybfMgqAu6_Nbr153Smy5N-3snJrgp8858XuYeUl_ck";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || SUPABASE_URL_FALLBACK;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  SUPABASE_ANON_KEY_FALLBACK;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export type SiteImage = {
  slot: string;
  url: string;
  alt: string | null;
  sort_order: number;
};

const STORAGE =
  "https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images";

/** Last-resort public URLs if the DB read fails on the deploy host. */
const FALLBACK_SITE_IMAGES: Record<string, SiteImage> = {
  hero_main: {
    slot: "hero_main",
    url: `${STORAGE}/rafaella-mendes-diniz-et_78QkMMQs-unsplash2.jpg`,
    alt: "Hair up hero portrait",
    sort_order: 1,
  },
  portrait_eye: {
    slot: "portrait_eye",
    url: `${STORAGE}/see-plus-r2ufKZ2vQh0-unsplash2.jpg`,
    alt: "Portrait with light across the eye",
    sort_order: 2,
  },
  portrait_flow: {
    slot: "portrait_flow",
    url: `${STORAGE}/tengyart-wpRfk1NT6Ng-unsplash.jpg`,
    alt: "Portrait with flowing hair",
    sort_order: 3,
  },
  portrait_veil: {
    slot: "portrait_veil",
    url: `${STORAGE}/igor-rand-sY3CosjuaXw-unsplash2.jpg`,
    alt: "Portrait with hair veiling the face",
    sort_order: 4,
  },
  booking_hero: {
    slot: "booking_hero",
    url: `${STORAGE}/ela-de-pure-y-jhNJt0ZsM-unsplash.jpg`,
    alt: "Booking hero background",
    sort_order: 10,
  },
};

async function fetchSiteImageRows(
  url: string,
  key: string,
): Promise<Record<string, SiteImage>> {
  const endpoint = new URL(`${url}/rest/v1/site_images`);
  endpoint.searchParams.set("select", "slot,url,alt,sort_order");
  endpoint.searchParams.set("order", "sort_order.asc");

  const res = await fetch(endpoint.toString(), {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    // Avoid caching an empty/error response forever on the CDN edge.
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("[getSiteImages]", url, res.status, await res.text());
    return {};
  }

  const data = (await res.json()) as SiteImage[];
  const map: Record<string, SiteImage> = {};
  for (const row of data ?? []) map[row.slot] = row;
  return map;
}

/**
 * Fetches all site images and returns them keyed by their `slot`.
 * Uses plain fetch (not supabase-js realtime). Retries with known-good
 * credentials if Vercel env vars point at the wrong project, and falls
 * back to public Storage URLs so the site never ships imageless.
 */
export async function getSiteImages(): Promise<Record<string, SiteImage>> {
  try {
    let map = await fetchSiteImageRows(supabaseUrl, supabaseAnonKey);

    const usingFallbackCreds =
      supabaseUrl === SUPABASE_URL_FALLBACK &&
      supabaseAnonKey === SUPABASE_ANON_KEY_FALLBACK;

    if (Object.keys(map).length === 0 && !usingFallbackCreds) {
      map = await fetchSiteImageRows(
        SUPABASE_URL_FALLBACK,
        SUPABASE_ANON_KEY_FALLBACK,
      );
    }

    return Object.keys(map).length > 0 ? map : FALLBACK_SITE_IMAGES;
  } catch (err) {
    console.error("[getSiteImages]", err);
    return FALLBACK_SITE_IMAGES;
  }
}

export type ServiceItem = {
  id: string;
  name: string;
  price: number;
  sort_order: number;
};

export type ServiceCategory = {
  id: string;
  label: string;
  sort_order: number;
  services: ServiceItem[];
};

/**
 * Fetches active services grouped by category (for admin-editable price list).
 * Public read via RLS. Safe to call from Server Components.
 */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const { data, error } = await supabase
    .from("service_categories")
    .select("id, label, sort_order, services(id, name, price, sort_order)")
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, foreignTable: "services" });

  if (error) {
    console.error("[getServiceCategories]", error.message);
    return FALLBACK_SERVICE_CATEGORIES;
  }

  const categories = (data ?? []).map((cat) => ({
    id: cat.id as string,
    label: cat.label as string,
    sort_order: cat.sort_order as number,
    services: ((cat.services as ServiceItem[] | null) ?? []).map(
      ({ id, name, price, sort_order }) => ({ id, name, price, sort_order }),
    ),
  }));

  return categories.length > 0 ? categories : FALLBACK_SERVICE_CATEGORIES;
}

/** Temporary seed used only until Supabase tables are created / populated. */
const FALLBACK_SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "cut",
    label: "CUT",
    sort_order: 1,
    services: [
      { id: "cut-1", name: "컷", price: 25000, sort_order: 1 },
      { id: "cut-2", name: "시그니처 레이어드 / 디자인 컷", price: 35000, sort_order: 2 },
      { id: "cut-3", name: "맨즈 디자인 컷 (+ 다운펌 패키지)", price: 60000, sort_order: 3 },
    ],
  },
  {
    id: "perm",
    label: "PERM",
    sort_order: 2,
    services: [
      { id: "perm-1", name: "디자인 일반펌", price: 90000, sort_order: 1 },
      { id: "perm-2", name: "셋팅 / 디지털 열펌", price: 160000, sort_order: 2 },
      { id: "perm-3", name: "시그니처 볼륨매직 / 매직셋팅", price: 200000, sort_order: 3 },
    ],
  },
  {
    id: "color",
    label: "COLOR",
    sort_order: 3,
    services: [
      { id: "color-1", name: "베이직 전체 컬러", price: 100000, sort_order: 1 },
      { id: "color-2", name: "프리미엄 케어 컬러", price: 140000, sort_order: 2 },
      { id: "color-3", name: "디자인 탈색 / 발레아쥬 (1회 기준)", price: 150000, sort_order: 3 },
    ],
  },
  {
    id: "clinic",
    label: "CLINIC & CARE",
    sort_order: 4,
    services: [
      { id: "clinic-1", name: "수분 단백질 집중 케어", price: 80000, sort_order: 1 },
      { id: "clinic-2", name: "프리미엄 모발 재생 클리닉", price: 150000, sort_order: 2 },
      { id: "clinic-3", name: "스칼프 두피 스파 케어", price: 70000, sort_order: 3 },
    ],
  },
];

export type Designer = {
  id: string;
  name: string;
  sort_order: number;
};

export type BookingSettings = {
  deposit_rate: number;
  deposit_min: number;
  time_slots: string[];
  privacy_terms: string;
};

const FALLBACK_DESIGNERS: Designer[] = [
  { id: "d1", name: "미나", sort_order: 1 },
  { id: "d2", name: "소라", sort_order: 2 },
  { id: "d3", name: "준우", sort_order: 3 },
];

const FALLBACK_BOOKING_SETTINGS: BookingSettings = {
  deposit_rate: 0.2,
  deposit_min: 10000,
  time_slots: ["10:00", "10:30", "11:00", "11:30", "13:00", "14:00"],
  privacy_terms:
    "수집 항목: 이름, 연락처, 예약 일시, 선택 시술, 요청사항\n이용 목적: 예약 확인, 시술 준비, 노쇼 방지 및 고객 응대\n보유 기간: 관련 법령에 따른 기간 또는 목적 달성 시까지\n동의 거부 시 예약 서비스 이용이 제한될 수 있습니다.",
};

export async function getDesigners(): Promise<Designer[]> {
  const { data, error } = await supabase
    .from("designers")
    .select("id, name, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getDesigners]", error.message);
    return FALLBACK_DESIGNERS;
  }
  return (data?.length ? data : FALLBACK_DESIGNERS) as Designer[];
}

export async function getBookingSettings(): Promise<BookingSettings> {
  const { data, error } = await supabase
    .from("booking_settings")
    .select("deposit_rate, deposit_min, time_slots, privacy_terms")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[getBookingSettings]", error.message);
    return FALLBACK_BOOKING_SETTINGS;
  }

  return {
    deposit_rate: Number(data.deposit_rate),
    deposit_min: Number(data.deposit_min),
    time_slots: (data.time_slots as string[]) ?? FALLBACK_BOOKING_SETTINGS.time_slots,
    privacy_terms: (data.privacy_terms as string) ?? FALLBACK_BOOKING_SETTINGS.privacy_terms,
  };
}

/** 예약금 = max(최소금액, round(합계 × 비율)) */
export function calcDeposit(
  total: number,
  rate: number,
  min: number,
): number {
  if (total <= 0) return 0;
  return Math.max(min, Math.round(total * rate));
}

export type CreateBookingInput = {
  designerId: string | null;
  designerName: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTime: string;
  customerName: string;
  customerPhone: string;
  requests: string;
  consent: boolean;
  totalPrice: number;
  depositAmount: number;
  services: { id: string; name: string; price: number }[];
};

export async function createBooking(input: CreateBookingInput) {
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      designer_id: input.designerId,
      designer_name: input.designerName,
      booking_date: input.bookingDate,
      booking_time: input.bookingTime,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      requests: input.requests || null,
      consent: input.consent,
      total_price: input.totalPrice,
      deposit_amount: input.depositAmount,
      status: "pending_payment",
    })
    .select("id")
    .single();

  if (error || !booking) {
    return { ok: false as const, error: error?.message ?? "booking insert failed" };
  }

  if (input.services.length > 0) {
    const rows = input.services.map((s, i) => ({
      booking_id: booking.id,
      service_id: s.id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      )
        ? s.id
        : null,
      service_name: s.name,
      price: s.price,
      sort_order: i + 1,
    }));
    const { error: svcErr } = await supabase.from("booking_services").insert(rows);
    if (svcErr) {
      return { ok: false as const, error: svcErr.message };
    }
  }

  return { ok: true as const, id: booking.id as string };
}