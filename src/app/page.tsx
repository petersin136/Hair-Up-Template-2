import Image from "next/image";
import BookingSection, {
  BOOKING_SECTION_HEIGHT,
} from "@/components/BookingSection";
import ServicesSection, {
  SERVICES_SECTION_HEIGHT,
} from "@/components/ServicesSection";
import {
  getBookingSettings,
  getDesigners,
  getServiceCategories,
  getSiteImages,
} from "@/lib/supabase";

export const revalidate = 60;

const HERO_HEIGHT = 3321;
const SERVICES_TOP = HERO_HEIGHT;
const BOOKING_TOP = HERO_HEIGHT + SERVICES_SECTION_HEIGHT;

export default async function Home() {
  const [images, categories, designers, bookingSettings] = await Promise.all([
    getSiteImages(),
    getServiceCategories(),
    getDesigners(),
    getBookingSettings(),
  ]);
  const src = (slot: string) => images[slot]?.url ?? "";
  const alt = (slot: string) => images[slot]?.alt ?? "";

  return (
    <main
      className="canvas-1440 bg-bg text-fg"
      style={{
        height: HERO_HEIGHT + SERVICES_SECTION_HEIGHT + BOOKING_SECTION_HEIGHT,
      }}
    >
      {/* ---------------- NAV ---------------- */}
      <nav
        className="absolute flex items-center justify-between"
        style={{ top: 42, left: 49, right: 55, height: 46 }}
      >
        <ul
          className="flex items-center"
          style={{
            gap: 34,
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            letterSpacing: "0.08em",
            fontWeight: 400,
          }}
        >
          <li className="uppercase" style={{ borderBottom: "1px solid #f4f4f4", paddingBottom: 2 }}>
            About
          </li>
          <li className="uppercase text-muted">Services</li>
          <li className="uppercase text-muted">Review</li>
        </ul>

        <button
          className="uppercase"
          style={{
            width: 195,
            height: 45,
            background: "#292929",
            color: "#ffffff",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            letterSpacing: "0.14em",
            borderRadius: 3,
          }}
        >
          Book Now
        </button>
      </nav>

      {/* ---------------- HERO TITLE ---------------- */}
      <h1
        className="absolute text-center"
        style={{
          top: 138,
          left: 0,
          width: 1440,
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 200,
          letterSpacing: "0.02em",
          lineHeight: 1,
          color: "#f4f4f4",
        }}
      >
        Hair up
      </h1>

      {/* ---------------- HERO MAIN IMAGE ---------------- */}
      <div
        className="absolute overflow-hidden"
        style={{ left: 428, top: 405, width: 581, height: 649 }}
      >
        {src("hero_main") && (
          <Image
            src={src("hero_main")}
            alt={alt("hero_main")}
            fill
            priority
            sizes="581px"
            style={{ objectFit: "cover" }}
          />
        )}
      </div>

      {/* pager */}
      <div
        className="absolute text-muted uppercase"
        style={{
          right: 55,
          top: 672,
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          letterSpacing: "0.1em",
        }}
      >
        01&nbsp;/&nbsp;03
      </div>

      {/* ---------------- CAPTION + HEADING + BODY ---------------- */}
      <div
        className="absolute text-center uppercase text-muted"
        style={{
          top: 1132,
          left: 0,
          width: 1440,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          letterSpacing: "0.22em",
        }}
      >
        Visual Artist. Mina Kim
      </div>

      <h2
        className="absolute text-center"
        style={{
          top: 1167,
          left: 0,
          width: 1440,
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: 50,
          lineHeight: "84px",
          color: "#efefef",
        }}
      >
        Sculpting Individuality
        <br />
        Through Silhouette
      </h2>

      <p
        className="absolute text-center"
        style={{
          top: 1385,
          left: 0,
          width: 1440,
          fontFamily: "var(--font-kr)",
          fontWeight: 600,
          fontSize: 18,
          color: "#dcdcdc",
        }}
      >
        비주얼 아티스트 Mina Kim이 재단하는 헤어의 미학
      </p>

      <p
        className="absolute text-center text-muted"
        style={{
          top: 1428,
          left: 0,
          width: 1440,
          fontFamily: "var(--font-kr)",
          fontWeight: 300,
          fontSize: 15,
          lineHeight: "27px",
        }}
      >
        일상적인 트렌드를 좇기보다, 낯선 실루엣으로 상상력을 좇습니다.
        <br />
        강렬하게 피어나는 라인으로 실루엣을 완성합니다.
      </p>

      {/* ---------------- PORTRAITS GRID ---------------- */}
      <div
        className="absolute overflow-hidden"
        style={{ left: 383, top: 1638, width: 590, height: 668 }}
      >
        {src("portrait_eye") && (
          <Image src={src("portrait_eye")} alt={alt("portrait_eye")} fill sizes="590px" style={{ objectFit: "cover" }} />
        )}
      </div>

      <div
        className="absolute overflow-hidden"
        style={{ left: 146, top: 1995, width: 516, height: 769 }}
      >
        {src("portrait_flow") && (
          <Image src={src("portrait_flow")} alt={alt("portrait_flow")} fill sizes="516px" style={{ objectFit: "cover" }} />
        )}
      </div>

      <div
        className="absolute overflow-hidden"
        style={{ left: 782, top: 2565, width: 506, height: 671 }}
      >
        {src("portrait_veil") && (
          <Image src={src("portrait_veil")} alt={alt("portrait_veil")} fill sizes="506px" style={{ objectFit: "cover" }} />
        )}
      </div>

      <h3
        className="absolute"
        style={{
          left: 778,
          top: 2380,
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: 46,
          letterSpacing: "0.07em",
          color: "#efefef",
        }}
      >
        PORTRAITS <em style={{ fontStyle: "italic", letterSpacing: "0.02em" }}>of</em> HAIR
      </h3>

      {/* ---------------- THE ART of DETAILS ---------------- */}
      <h3
        className="absolute"
        style={{
          left: 136,
          top: 2996,
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: 50,
          lineHeight: "62px",
          letterSpacing: "0.05em",
          color: "#efefef",
        }}
      >
        THE ART <em style={{ fontStyle: "italic" }}>of</em>
        <br />
        DETAILS
      </h3>

      <p
        className="absolute text-muted"
        style={{
          left: 146,
          top: 3188,
          fontFamily: "var(--font-kr)",
          fontWeight: 300,
          fontSize: 14,
          lineHeight: "22px",
        }}
      >
        오직 한 사람을 향한 고요한 몰입의 시간,
        <br />
        머리카락 끝 올의 결까지 정교하게 담아냅니다.
      </p>

      {/* ---------------- OUR SERVICES ---------------- */}
      <ServicesSection top={SERVICES_TOP} categories={categories} />

      {/* ---------------- BOOKING ---------------- */}
      <BookingSection
        top={BOOKING_TOP}
        heroUrl={src("booking_hero")}
        designers={designers}
        categories={categories}
        settings={bookingSettings}
      />
    </main>
  );
}
