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
