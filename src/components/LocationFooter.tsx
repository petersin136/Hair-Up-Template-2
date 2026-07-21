import Image from "next/image";
import Link from "next/link";
import {
  FOOTER_SECTION_HEIGHT,
  LOCATION_SECTION_HEIGHT,
} from "@/lib/sections";

const LOC_IMG =
  "https://ydjzhldfwuqbtukenfbm.supabase.co/storage/v1/object/public/site-images/ela-de-pure-V0Jz0gkzI5s-unsplash.jpg";

/** Measured from 260716_HU_TEMPLATE_06 → 1440. */
const IMG = { left: 0, top: 0, width: 720, height: 554 } as const;
const DIVIDER_TOP = LOCATION_SECTION_HEIGHT;
const DIVIDER_COLOR = "#3c3c3c";

type Props = {
  top: number;
  imageUrl?: string;
};

export default function LocationFooter({ top, imageUrl = LOC_IMG }: Props) {
  const totalH = LOCATION_SECTION_HEIGHT + FOOTER_SECTION_HEIGHT;

  return (
    <section
      className="absolute left-0 w-full bg-black"
      style={{ top, height: totalH }}
      aria-label="Hours, location and footer"
    >
      {/* -------- LOCATION image -------- */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: IMG.left,
          top: IMG.top,
          width: IMG.width,
          height: IMG.height,
        }}
      >
        <Image
          src={imageUrl}
          alt="Hair up salon interior"
          fill
          sizes="720px"
          className="object-cover"
        />
      </div>

      {/* -------- HOURS / LOCATION copy (vertically centered vs image) -------- */}
      <div
        className="absolute flex flex-col justify-center"
        style={{
          left: 720,
          top: 0,
          width: 720,
          height: IMG.height,
          paddingLeft: 104,
          paddingRight: 80,
          boxSizing: "border-box",
        }}
      >
        <div>
          <h2
            className="uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: 40,
              letterSpacing: "0.08em",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            HOURS
          </h2>

          {/* Day | time columns (reference tab stop) */}
          <div
            style={{
              marginTop: 26,
              display: "grid",
              gridTemplateColumns: "118px max-content",
              columnGap: 36,
              rowGap: 10,
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: 1.3,
              color: "#ffffff",
              letterSpacing: "0.06em",
            }}
          >
            <span>MON - FRI</span>
            <span>10:00 AM - 08:00 PM</span>
            <span>SAT - SUN</span>
            <span>10:00 AM - 07:00 PM</span>
          </div>

          <h2
            className="uppercase"
            style={{
              marginTop: 78,
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: 40,
              letterSpacing: "0.08em",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            LOCATION
          </h2>

          <p
            style={{
              marginTop: 26,
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "0.04em",
              color: "#ffffff",
              lineHeight: 1.3,
            }}
          >
            T&nbsp;&nbsp;
            <a
              href="tel:0212345678"
              className="transition-opacity duration-200 hover:opacity-55"
            >
              02.1234.5678
            </a>
          </p>
          <p
            style={{
              marginTop: 14,
              fontFamily: "var(--font-kr)",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "24px",
              color: "#ffffff",
            }}
          >
            서울특별시 강남구 청담동 123-4, 2층
          </p>
          <p
            style={{
              marginTop: 2,
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: "22px",
              color: "#c8c8c8",
              letterSpacing: "0.02em",
            }}
          >
            2F, 123-4, Cheongdam-dong, Gangnam-gu, Seoul
          </p>
        </div>
      </div>

      {/* -------- Divider -------- */}
      <div
        className="absolute left-0 w-full"
        style={{
          top: DIVIDER_TOP,
          height: 1,
          background: DIVIDER_COLOR,
        }}
      />

      {/* -------- FOOTER -------- */}
      <div
        className="absolute left-0 w-full"
        style={{ top: DIVIDER_TOP, height: FOOTER_SECTION_HEIGHT }}
      >
        <p
          className="absolute uppercase"
          style={{
            left: 52,
            top: 62,
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: 52,
            letterSpacing: "0.08em",
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          HAIR UP
        </p>

        <div
          className="absolute"
          style={{
            left: 52,
            top: 140,
            fontFamily: "var(--font-kr)",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "22px",
            color: "#d0d0d0",
          }}
        >
          <p>(주)헤어업</p>
          <p>대표자 홍길동</p>
          <p>사업자등록번호 123-45-67890</p>
          <p>주소 서울특별시 강남구 청담동 123-4, 2층</p>
        </div>

        <div
          className="absolute text-right"
          style={{ right: 52, top: 62, width: 280 }}
        >
          <p
            className="uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: "0.1em",
              color: "#ffffff",
            }}
          >
            CUSTOMER SERVICE
          </p>
          <p
            style={{
              marginTop: 16,
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: 18,
              letterSpacing: "0.04em",
              color: "#ffffff",
            }}
          >
            <a
              href="tel:0212345678"
              className="transition-opacity duration-200 hover:opacity-55"
            >
              02.1234.5678
            </a>
          </p>
          <p
            style={{
              marginTop: 6,
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: 13,
              color: "#d0d0d0",
            }}
          >
            <a
              href="mailto:info@hairup.com"
              className="transition-opacity duration-200 hover:opacity-55"
            >
              info@hairup.com
            </a>
          </p>

          <p
            className="uppercase"
            style={{
              marginTop: 36,
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: "0.1em",
              color: "#ffffff",
            }}
          >
            SOCIAL
          </p>
          <div
            className="mt-4 flex flex-col items-end gap-2"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: 13,
              letterSpacing: "0.12em",
            }}
          >
            <a
              href="https://www.instagram.com/hairup/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-opacity duration-200 hover:opacity-55"
            >
              INSTAGRAM
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-opacity duration-200 hover:opacity-55"
            >
              FACEBOOK
            </a>
          </div>
        </div>

        <p
          className="absolute"
          style={{
            left: 52,
            bottom: 48,
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "#8a8a8a",
          }}
        >
          © 2026 COPYRIGHT BY HAIR UP | DESIGNED BY MARANATHA STUDIO |{" "}
          <Link
            href="/admin"
            className="text-[#8a8a8a] underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:text-white hover:decoration-white"
          >
            ADMIN
          </Link>
        </p>
      </div>
    </section>
  );
}

export const LOCATION_FOOTER_HEIGHT =
  LOCATION_SECTION_HEIGHT + FOOTER_SECTION_HEIGHT;
