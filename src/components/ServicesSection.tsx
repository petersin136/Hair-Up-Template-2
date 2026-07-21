import type { ServiceCategory } from "@/lib/supabase";
import { SERVICES_SECTION_HEIGHT as SECTION_H } from "@/lib/sections";

/** Pixel-perfect OUR SERVICES section (PC 1440). Positions from design PNG. */

/** Measured divider colors (per-position, not unified). */
const DIVIDERS: { top: number; color: string }[] = [
  { top: 80, color: "#323232" },
  { top: 336, color: "#343434" },
  { top: 525, color: "#646464" },
  { top: 714, color: "#666666" },
  { top: 903, color: "#565656" },
];

/** Category block tops matching design (label shares first service row). */
const CATEGORY_TOPS = [368, 558, 747, 932] as const;
/** Service row offsets within a category block (top-to-top). */
const ROW_OFFSETS = [0, 40, 75] as const;

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR");
}

type Props = {
  /** Absolute top of this section on the 1440 canvas. */
  top: number;
  categories: ServiceCategory[];
};

export default function ServicesSection({ top, categories }: Props) {
  return (
    <section
      id="services"
      className="absolute left-0 w-full"
      style={{ top, height: SECTION_H, scrollMarginTop: 24 }}
      aria-label="Our Services"
    >
      {DIVIDERS.map((d) => (
        <div
          key={d.top}
          className="absolute left-0"
          style={{
            top: d.top,
            left: 51,
            width: 1337,
            height: 1,
            background: d.color,
          }}
        />
      ))}

      <h2
        className="absolute uppercase"
        style={{
          left: 49,
          top: 114,
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: 38,
          letterSpacing: "0.04em",
          color: "#ffffff",
          lineHeight: 1,
        }}
      >
        Our Services
      </h2>

      <p
        className="absolute"
        style={{
          left: 714,
          top: 117,
          fontFamily: "var(--font-kr)",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "22px",
          color: "#CDCDCD",
        }}
      >
        기장 및 모량, 사용하는 약제 종류에 따라 시술 금액이 변동될 수 있습니다.
        <br />
        디자이너 직급에 따라 직급별 수수료가 적용될 수 있습니다.
      </p>

      <a
        href="#booking"
        className="svc-book-btn absolute flex items-center justify-between"
        style={{
          left: 714,
          top: 207,
          width: 315,
          height: 63,
          paddingLeft: 22,
          paddingRight: 22,
          fontFamily: "var(--font-kr)",
          fontWeight: 400,
          fontSize: 15,
          textDecoration: "none",
        }}
      >
        <span>원하는 시술로 바로 예약하기</span>
        <span aria-hidden="true">&gt;</span>
      </a>

      {categories.map((cat, i) => {
        const blockTop = CATEGORY_TOPS[i];
        if (blockTop == null) return null;
        return (
          <div key={cat.id} className="absolute left-0 w-full" style={{ top: blockTop }}>
            <div
              className="absolute uppercase"
              style={{
                left: 49,
                top: 0,
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: 36,
                letterSpacing: "0.02em",
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              {cat.label}
            </div>

            {cat.services.map((svc, j) => {
              const rowTop = ROW_OFFSETS[j] ?? j * 35;
              return (
                <div
                  key={svc.id}
                  className="absolute flex justify-between"
                  style={{
                    left: 714,
                    right: 51,
                    top: rowTop,
                    fontFamily: "var(--font-kr)",
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: 1.2,
                    color: "#ffffff",
                  }}
                >
                  <span>{svc.name}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>
                    {formatPrice(svc.price)}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}
