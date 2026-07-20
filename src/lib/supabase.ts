import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type SiteImage = {
  slot: string;
  url: string;
  alt: string | null;
  sort_order: number;
};

/**
 * Fetches all site images and returns them keyed by their `slot`.
 * Read-only, public data (RLS: public select). Safe to call from Server Components.
 */
export async function getSiteImages(): Promise<Record<string, SiteImage>> {
  const { data, error } = await supabase
    .from("site_images")
    .select("slot, url, alt, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getSiteImages]", error.message);
    return {};
  }

  const map: Record<string, SiteImage> = {};
  for (const row of data ?? []) map[row.slot] = row as SiteImage;
  return map;
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
