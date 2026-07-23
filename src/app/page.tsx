import Image from "next/image";
import BookingSection from "@/components/BookingSection";
import FeatureVideo from "@/components/FeatureVideo";
import LocationFooter from "@/components/LocationFooter";
import ReviewSection from "@/components/ReviewSection";
import ServicesSection from "@/components/ServicesSection";
import {
  BOOKING_SECTION_HEIGHT,
  FEATURE_VIDEO_HEIGHT,
  FOOTER_SECTION_HEIGHT,
  HERO_HEIGHT,
  LOCATION_SECTION_HEIGHT,
  REVIEW_SECTION_HEIGHT,
  SERVICES_SECTION_HEIGHT,
} from "@/lib/sections";
import {
  getBookingSettings,
  getDesigners,
  getInstagramPosts,
  getReviews,
  getServiceCategories,
  getSiteImages,
} from "@/lib/supabase";

export const revalidate = 60;

const SERVICES_TOP = HERO_HEIGHT;
const BOOKING_TOP = HERO_HEIGHT + SERVICES_SECTION_HEIGHT;
const VIDEO_TOP = BOOKING_TOP + BOOKING_SECTION_HEIGHT;
const REVIEW_TOP = VIDEO_TOP + FEATURE_VIDEO_HEIGHT;
const LOCATION_TOP = REVIEW_TOP + REVIEW_SECTION_HEIGHT;

const LOCATION_FALLBACK =
  "https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images/ela-de-pure-V0Jz0gkzI5s-unsplash.jpg";

export default async function Home() {
  const [images, categories, designers, bookingSettings, reviews, igPosts] =
    await Promise.all([
      getSiteImages(),
      getServiceCategories(),
      getDesigners(),
      getBookingSettings(),
      getReviews(),
      getInstagramPosts(),
    ]);
  const src = (slot: string) => images[slot]?.url ?? "";
  const alt = (slot: string) => images[slot]?.alt ?? "";

  return (
    <main
      className="canvas-1440 bg-bg text-fg"
      style={{
        height:
          HERO_HEIGHT +
          SERVICES_SECTION_HEIGHT +
          BOOKING_SECTION_HEIGHT +
          FEATURE_VIDEO_HEIGHT +
          REVIEW_SECTION_HEIGHT +
          LOCATION_SECTION_HEIGHT +
          FOOTER_SECTION_HEIGHT,
      }}
    >
      {/* ---------------- NAV ---------------- */}
      <nav
        className="absolute z-50 flex items-center justify-between"
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
          <li>
            <a href="#about" className="site-nav-link is-active uppercase">
              About
            </a>
          </li>
          <li>
            <a href="#services" className="site-nav-link uppercase">
              Services
            </a>
          </li>
          <li>
            <a href="#review" className="site-nav-link uppercase">
              Review
            </a>
          </li>
        </ul>

        <a href="#booking" className="site-book-now-btn uppercase">
          Book Now
        </a>
      </nav>

      {/* ---------------- HERO TITLE ---------------- */}
      <h1
        id="about"
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
          scrollMarginTop: 24,
          pointerEvents: "none",
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
        비주얼 아티스트 Mina Kim이 제안하는 헤어의 미학
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
        일시적인 트렌드를 좇기보다, 당신 본연의 정체성과 삶의 우아함에
        <br />
        완벽하게 녹아드는 비스포크 실루엣을 디자인합니다.
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
        오직 한 사람을 향한 고요한 몰입의 시간.
        <br />
        머리카락 한 올의 정취까지 정교하게 담아냅니다.
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

      {/* ---------------- FEATURE VIDEO ---------------- */}
      <FeatureVideo top={VIDEO_TOP} />

      {/* ---------------- REVIEW + Instagram ---------------- */}
      <ReviewSection top={REVIEW_TOP} reviews={reviews} posts={igPosts} />

      {/* ---------------- HOURS / LOCATION + FOOTER ---------------- */}
      <LocationFooter
        top={LOCATION_TOP}
        imageUrl={src("location_interior") || LOCATION_FALLBACK}
      />
    </main>
  );
}
