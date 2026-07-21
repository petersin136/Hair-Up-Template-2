"use client";

import Image from "next/image";
import { useState } from "react";
import { REVIEW_SECTION_HEIGHT as SECTION_H } from "@/lib/sections";
import {
  INSTAGRAM_URL,
  type InstagramPost,
  type Review,
} from "@/lib/supabase";

/** Measured from 260716_HU_TEMPLATE_05 mockups → 1440 canvas. */
const MAIN = { left: 0, top: 159, width: 720, height: 554 } as const;
const COPY = { left: 824, top: 221, width: 516 } as const;
const THUMB = {
  top: 875,
  height: 330,
  left: 49,
  width: 253,
  gap: 20,
} as const;

type Props = {
  top: number;
  reviews: Review[];
  posts: InstagramPost[];
};

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex"
      style={{ gap: 4, color: "#ffffff", fontSize: 14, letterSpacing: "0.12em" }}
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: rating }, (_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export default function ReviewSection({ top, reviews, posts }: Props) {
  const list = reviews.length > 0 ? reviews : [];
  const [index, setIndex] = useState(0);
  const current = list[index] ?? null;
  const n = list.length;

  const go = (dir: -1 | 1) => {
    if (n === 0) return;
    setIndex((i) => (i + dir + n) % n);
  };

  return (
    <section
      className="absolute left-0 w-full bg-black"
      style={{ top, height: SECTION_H, scrollMarginTop: 24 }}
      aria-label="Reviews"
      id="review"
    >
      {/* ---- Main review image ---- */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: MAIN.left,
          top: MAIN.top,
          width: MAIN.width,
          height: MAIN.height,
        }}
      >
        {current?.image_url ? (
          <Image
            key={current.id}
            src={current.image_url}
            alt={`${current.artist_name} review`}
            fill
            sizes="720px"
            className="object-cover transition-opacity duration-500"
            style={{ objectPosition: "50% 30%" }}
            priority={false}
          />
        ) : null}
      </div>

      {/* ---- Copy + nav ---- */}
      {current ? (
        <div
          className="absolute"
          style={{
            left: COPY.left,
            top: COPY.top,
            width: COPY.width,
          }}
        >
          <div className="relative flex items-start justify-between" style={{ height: 48 }}>
            <h2
              className="uppercase"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: 48,
                letterSpacing: "0.06em",
                color: "#ffffff",
                lineHeight: 1,
              }}
            >
              REVIEW
            </h2>

            <div className="flex items-center" style={{ gap: 22, marginTop: 10 }}>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="flex h-8 w-8 items-center justify-center opacity-65 transition-opacity hover:opacity-100"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <span
                  aria-hidden
                  style={{
                    display: "block",
                    width: 10,
                    height: 10,
                    borderLeft: "1.5px solid #fff",
                    borderBottom: "1.5px solid #fff",
                    transform: "rotate(45deg)",
                  }}
                />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="flex h-8 w-8 items-center justify-center opacity-65 transition-opacity hover:opacity-100"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <span
                  aria-hidden
                  style={{
                    display: "block",
                    width: 10,
                    height: 10,
                    borderRight: "1.5px solid #fff",
                    borderTop: "1.5px solid #fff",
                    transform: "rotate(45deg)",
                  }}
                />
              </button>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <Stars rating={current.rating} />
          </div>

          <div key={current.id} style={{ marginTop: 28 }}>
            <p
              style={{
                fontFamily: "var(--font-kr)",
                fontWeight: 500,
                fontSize: 16,
                color: "#ffffff",
                lineHeight: 1.4,
              }}
            >
              Artist. {current.artist_name}
            </p>
            <p
              className="uppercase"
              style={{
                marginTop: 6,
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: 12,
                letterSpacing: "0.08em",
                color: "#cfcfcf",
                lineHeight: 1.4,
              }}
            >
              {current.service_label}
            </p>
            <p
              style={{
                marginTop: 22,
                fontFamily: "var(--font-kr)",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "24px",
                color: "#ffffff",
              }}
            >
              {current.body}
            </p>
            <p
              style={{
                marginTop: 28,
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: 12,
                color: "#8a8a8a",
                letterSpacing: "0.04em",
              }}
            >
              {current.reviewer_mask} / {current.reviewed_on}
            </p>
          </div>
        </div>
      ) : null}

      {/* ---- Instagram strip ---- */}
      <div
        className="absolute left-0 flex"
        style={{
          top: THUMB.top,
          left: THUMB.left,
          height: THUMB.height,
          gap: THUMB.gap,
        }}
      >
        {posts.map((post) => (
          <a
            key={post.id}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden"
            style={{ width: THUMB.width, height: THUMB.height }}
            aria-label="Follow us on Instagram @hairup"
          >
            <Image
              src={post.image_url}
              alt={post.alt ?? "Hair up Instagram"}
              fill
              sizes="253px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* Hover: dark veil + Follow us (mockup 05-3) */}
            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
              style={{ background: "rgba(0,0,0,0.85)" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: 28,
                  color: "#ffffff",
                  letterSpacing: "0.02em",
                  lineHeight: 1.15,
                }}
              >
                Follow us
              </span>
              <span
                style={{
                  marginTop: 8,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  fontSize: 13,
                  color: "#ffffff",
                  letterSpacing: "0.06em",
                }}
              >
                @hairup
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
