"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import {
  calcDeposit,
  createBooking,
  type BookingSettings,
  type Designer,
  type ServiceCategory,
  type ServiceItem,
} from "@/lib/supabase";
import { BOOKING_SECTION_HEIGHT as SECTION_H } from "@/lib/sections";

/** Hero band until solid black form (from design). */
const HERO_H = 615;
/** Calendar — vertically centered; height sized for ≤5–6 weeks without next-month dates. */
const CAL_H = 400;
const CAL = {
  left: 149,
  width: 508,
  height: CAL_H,
  top: Math.round((HERO_H - CAL_H) / 2),
} as const;
/** Approx height of BOOKING title + body + bullets (for vertical centering). */
const COPY_H = 200;
const COPY = {
  left: 742,
  top: CAL.top + Math.round((CAL.height - COPY_H) / 2),
} as const;

/** Fixed label width so `<` / `>` stay put for the longest month name. */
const MONTH_LABEL_WIDTH = 230;

type OpenMenu =
  | null
  | "designer"
  | "category"
  | "services"
  | "time"
  | "privacy";

type Props = {
  top: number;
  heroUrl: string;
  designers: Designer[];
  categories: ServiceCategory[];
  settings: BookingSettings;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatTagPrice(price: number) {
  return (price / 1000).toFixed(1);
}

function formatWon(n: number) {
  return n.toLocaleString("ko-KR");
}

function toDateKey(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
] as const;

function buildCalendarDays(year: number, month: number) {
  // month: 1-12. Grid starts Monday.
  // Leading (prev-month) days shown dimmed; trailing next-month days are blank (hidden).
  const first = new Date(year, month - 1, 1);
  const firstDow = (first.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevDays = new Date(year, month - 1, 0).getDate();

  const cells: {
    day: number;
    inMonth: boolean;
    empty?: boolean;
    key: string;
  }[] = [];

  for (let i = 0; i < firstDow; i++) {
    const d = prevDays - firstDow + 1 + i;
    const pm = month === 1 ? 12 : month - 1;
    const py = month === 1 ? year - 1 : year;
    cells.push({ day: d, inMonth: false, key: toDateKey(py, pm, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, key: toDateKey(year, month, d) });
  }
  // Complete only the last week — no extra weeks of next-month dates
  while (cells.length % 7 !== 0) {
    cells.push({ day: 0, inMonth: false, empty: true, key: `pad-${cells.length}` });
  }
  return cells;
}

export default function BookingSection({
  top,
  heroUrl,
  designers,
  categories,
  settings,
}: Props) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(
    toDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate()),
  );

  const [open, setOpen] = useState<OpenMenu>(null);
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [serviceCategoryId, setServiceCategoryId] = useState<string | null>(null);
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [requests, setRequests] = useState("");
  const [consent, setConsent] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const cells = useMemo(
    () => buildCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const total = selectedServices.reduce((s, x) => s + x.price, 0);
  const deposit = calcDeposit(total, settings.deposit_rate, settings.deposit_min);

  const canSubmit =
    !!designer &&
    selectedServices.length > 0 &&
    !!time &&
    !!selectedDate &&
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    consent &&
    !pending;

  const activeCategory = categories.find((c) => c.id === serviceCategoryId);

  function toggle(menu: OpenMenu) {
    setOpen((prev) => (prev === menu ? null : menu));
  }

  function prevMonth() {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else setViewMonth((m) => m + 1);
  }

  function addService(svc: ServiceItem) {
    setSelectedServices((prev) =>
      prev.some((p) => p.id === svc.id) ? prev : [...prev, svc],
    );
    setOpen(null);
    setServiceCategoryId(null);
  }

  function removeService(id: string) {
    setSelectedServices((prev) => prev.filter((s) => s.id !== id));
  }

  function onSubmit() {
    if (!canSubmit || !designer) return;
    setStatusMsg(null);
    startTransition(async () => {
      const res = await createBooking({
        designerId: designer.id,
        designerName: designer.name,
        bookingDate: selectedDate,
        bookingTime: time,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        requests: requests.trim(),
        consent,
        totalPrice: total,
        depositAmount: deposit,
        services: selectedServices.map((s) => ({
          id: s.id,
          name: s.name,
          price: s.price,
        })),
      });
      if (!res.ok) {
        setStatusMsg(`저장 실패: ${res.error}`);
        return;
      }
      setStatusMsg("예약이 접수되었습니다. (결제 연동은 추후 적용)");
    });
  }

  const fieldLine = "1px solid #6a6a6a";
  const chevron = (
    <span style={{ fontSize: 10, opacity: 0.85 }} aria-hidden>
      ▾
    </span>
  );

  return (
    <section
      id="booking"
      className="absolute left-0 w-full"
      style={{ top, height: SECTION_H, scrollMarginTop: 24 }}
      aria-label="Booking"
    >
      {/* -------- HERO -------- */}
      <div className="absolute left-0 top-0 w-full overflow-hidden" style={{ height: HERO_H }}>
        {heroUrl && (
          <Image
            src={heroUrl}
            alt=""
            fill
            sizes="1440px"
            priority
            style={{
              objectFit: "cover",
              // Match reference crop: shelf/products sit higher in the frame
              objectPosition: "50% 18%",
              filter: "none",
              transform: "none",
            }}
          />
        )}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.18)" }} />

        {/* Calendar */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: CAL.left,
            top: CAL.top,
            width: CAL.width,
            height: CAL.height,
            background: "#ffffff",
            color: "#111",
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              height: 66,
              background: "#000000",
              color: "#ffffff",
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 20,
              letterSpacing: "0.1em",
              gap: 16,
            }}
          >
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous month"
              style={{ width: 28, flexShrink: 0, opacity: 0.9 }}
            >
              &lt;
            </button>
            <span
              style={{
                display: "inline-block",
                width: MONTH_LABEL_WIDTH,
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              {MONTHS[viewMonth - 1]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              style={{ width: 28, flexShrink: 0, opacity: 0.9 }}
            >
              &gt;
            </button>
          </div>

          <div
            style={{
              height: CAL.height - 66,
              padding: "18px 22px 22px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(7, 1fr)",
                textAlign: "center",
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                marginBottom: 14,
              }}
            >
              {WEEKDAYS.map((d, i) => (
                <div key={d} style={{ color: i === 6 ? "#b04a3a" : "#6a6a6a" }}>
                  {d}
                </div>
              ))}
            </div>
            <div
              className="grid flex-1"
              style={{
                gridTemplateColumns: "repeat(7, 1fr)",
                gridAutoRows: "1fr",
                textAlign: "center",
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                alignContent: "space-between",
              }}
            >
              {cells.map((c, idx) => {
                const isSun = idx % 7 === 6;
                const selected = c.inMonth && c.key === selectedDate;
                if (c.empty) {
                  return <div key={c.key} />;
                }
                return (
                  <button
                    key={`${c.key}-${idx}`}
                    type="button"
                    disabled={!c.inMonth}
                    onClick={() => c.inMonth && setSelectedDate(c.key)}
                    className="mx-auto flex items-center justify-center"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      border: selected ? "1px solid #111" : "1px solid transparent",
                      color: !c.inMonth
                        ? "#c8c8c8"
                        : isSun
                          ? "#b04a3a"
                          : "#222",
                      background: "transparent",
                    }}
                  >
                    {c.day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOOKING copy — position/size from design (title sits beside calendar body, not above it) */}
        <div className="absolute" style={{ left: COPY.left, top: COPY.top, width: 560, color: "#fff" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 56,
              letterSpacing: "0.04em",
              lineHeight: 1,
              marginBottom: 22,
            }}
          >
            BOOKING
          </h2>
          <p
            style={{
              fontFamily: "var(--font-kr)",
              fontSize: 14,
              lineHeight: "24px",
              fontWeight: 400,
              maxWidth: 460,
              marginBottom: 16,
            }}
          >
            신중한 예약과 고객님의 소중한 시간 가치를 위해
            <br />
            노쇼 방지를 위한 사전 예약금이 결제됩니다.
          </p>
          <ul
            style={{
              fontFamily: "var(--font-kr)",
              fontSize: 14,
              lineHeight: "24px",
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontWeight: 400,
            }}
          >
            <li>· 예약금은 시술 완료 후 최종 금액에서 차감됩니다.</li>
            <li>· 직급 및 모량에 따라 수수료가 적용될 수 있습니다.</li>
          </ul>
        </div>
      </div>

      {/* -------- FORM -------- */}
      <div className="absolute left-0 w-full" style={{ top: HERO_H, height: SECTION_H - HERO_H }}>
        {/* Left column */}
        <div className="absolute" style={{ left: 56, top: 67, width: 633 }}>
          {/* Designer */}
          <div className="relative" style={{ marginBottom: 0 }}>
            <button
              type="button"
              className="flex w-full items-center justify-between"
              style={{
                height: 44,
                borderBottom: fieldLine,
                fontFamily: "var(--font-kr)",
                fontSize: 16,
                color: "#fff",
                background: "transparent",
                textAlign: "left",
              }}
              onClick={() => toggle("designer")}
            >
              <span>{designer?.name ?? "디자이너 선택"}</span>
              {chevron}
            </button>
            {open === "designer" && (
              <div
                className="absolute z-20 w-full"
                style={{
                  top: 44,
                  border: "1px solid #ffffff",
                  background: "#000",
                }}
              >
                {designers.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className="block w-full text-left"
                    style={{
                      padding: "12px 16px",
                      fontFamily: "var(--font-kr)",
                      fontSize: 15,
                      color: "#fff",
                      background: designer?.id === d.id ? "#2a2a2a" : "transparent",
                    }}
                    onClick={() => {
                      setDesigner(d);
                      setOpen(null);
                    }}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service menu */}
          <div className="relative" style={{ marginTop: 48 }}>
            <button
              type="button"
              className="flex w-full items-center justify-between"
              style={{
                height: 44,
                borderBottom: selectedServices.length ? "none" : fieldLine,
                fontFamily: "var(--font-kr)",
                fontSize: 16,
                color: "#fff",
                background: "transparent",
                textAlign: "left",
              }}
              onClick={() => {
                setServiceCategoryId(null);
                toggle(open === "services" || open === "category" ? null : "category");
              }}
            >
              <span>시술 메뉴 선택</span>
              {chevron}
            </button>

            {selectedServices.length > 0 && (
              <div style={{ paddingTop: 10, paddingBottom: 8, borderBottom: fieldLine }}>
                {selectedServices.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between"
                    style={{
                      fontFamily: "var(--font-kr)",
                      fontSize: 15,
                      color: "#fff",
                      padding: "6px 0",
                    }}
                  >
                    <span>
                      {s.name}({formatTagPrice(s.price)})
                    </span>
                    <button
                      type="button"
                      aria-label="remove"
                      onClick={() => removeService(s.id)}
                      style={{ color: "#fff", opacity: 0.85 }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setServiceCategoryId(null);
                    setOpen("category");
                  }}
                  style={{
                    marginTop: 6,
                    fontFamily: "var(--font-kr)",
                    fontSize: 14,
                    color: "#fff",
                    opacity: 0.9,
                  }}
                >
                  + 시술 추가
                </button>
              </div>
            )}

            {(open === "category" || open === "services") && (
              <div
                className="absolute z-20 w-full"
                style={{
                  top: selectedServices.length > 0 ? "auto" : 44,
                  marginTop: selectedServices.length > 0 ? 8 : 0,
                  border: "1px solid #ffffff",
                  background: "#000",
                }}
              >
                {open === "category" &&
                  categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="block w-full text-left"
                      style={{
                        padding: "12px 16px",
                        fontFamily: "var(--font-sans)",
                        fontSize: 14,
                        letterSpacing: "0.06em",
                        color: "#fff",
                        background: "transparent",
                      }}
                      onClick={() => {
                        setServiceCategoryId(c.id);
                        setOpen("services");
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                {open === "services" &&
                  (activeCategory?.services ?? []).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="block w-full text-left"
                      style={{
                        padding: "12px 16px",
                        fontFamily: "var(--font-kr)",
                        fontSize: 14,
                        color: "#fff",
                        background: selectedServices.some((x) => x.id === s.id)
                          ? "#2a2a2a"
                          : "transparent",
                      }}
                      onClick={() => addService(s)}
                    >
                      {s.name}({formatTagPrice(s.price)})
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Time */}
          <div className="relative" style={{ marginTop: 48 }}>
            <button
              type="button"
              className="flex w-full items-center justify-between"
              style={{
                height: 44,
                borderBottom: fieldLine,
                fontFamily: "var(--font-kr)",
                fontSize: 16,
                color: "#fff",
                background: "transparent",
                textAlign: "left",
              }}
              onClick={() => toggle("time")}
            >
              <span>{time || "예약 시간 선택"}</span>
              {chevron}
            </button>
            {open === "time" && (
              <div
                className="absolute z-20 w-full"
                style={{
                  top: 44,
                  border: "1px solid #ffffff",
                  background: "#000",
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                {settings.time_slots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="block w-full text-left"
                    style={{
                      padding: "12px 16px",
                      fontFamily: "var(--font-sans)",
                      fontSize: 15,
                      color: "#fff",
                      background: time === t ? "#2a2a2a" : "transparent",
                    }}
                    onClick={() => {
                      setTime(t);
                      setOpen(null);
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="absolute" style={{ left: 750, top: 67, width: 638 }}>
          <label className="block" style={{ marginBottom: 0 }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="booking-field-input"
              style={{
                width: "100%",
                height: 44,
                border: "none",
                borderBottom: fieldLine,
                background: "transparent",
                color: "#c8c8c8",
                fontFamily: "var(--font-kr)",
                fontSize: 16,
                fontWeight: 400,
                outline: "none",
              }}
            />
          </label>

          <label className="block" style={{ marginTop: 48 }}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="전화번호"
              className="booking-field-input"
              style={{
                width: "100%",
                height: 44,
                border: "none",
                borderBottom: fieldLine,
                background: "transparent",
                color: "#c8c8c8",
                fontFamily: "var(--font-kr)",
                fontSize: 16,
                fontWeight: 400,
                outline: "none",
              }}
            />
          </label>

          <div style={{ marginTop: 48 }}>
            <div
              style={{
                fontFamily: "var(--font-kr)",
                fontSize: 16,
                fontWeight: 400,
                color: "#9a9a9a",
                marginBottom: 8,
              }}
            >
              요청사항
            </div>
            <p
              style={{
                fontFamily: "var(--font-kr)",
                fontSize: 12,
                lineHeight: "18px",
                fontWeight: 400,
                color: "#7a7a7a",
                marginBottom: 10,
              }}
            >
              시술 전 디자이너가 미리 알아야 할 모발 고민이나 요청사항이 있다면 자유롭게
              적어주세요.
            </p>
            <textarea
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              rows={3}
              className="booking-field-input"
              style={{
                width: "100%",
                border: "none",
                borderBottom: fieldLine,
                background: "transparent",
                color: "#c8c8c8",
                fontFamily: "var(--font-kr)",
                fontSize: 15,
                fontWeight: 400,
                outline: "none",
                resize: "none",
                lineHeight: "22px",
              }}
            />
          </div>

          <div style={{ marginTop: 28 }}>
            <div className="flex items-center justify-between" style={{ borderBottom: fieldLine, paddingBottom: 12 }}>
              <button
                type="button"
                className="flex items-center gap-3"
                style={{ cursor: "pointer", background: "transparent", border: "none", padding: 0 }}
                onClick={() => setConsent((v) => !v)}
              >
                <span
                  aria-hidden
                  style={{
                    width: 16,
                    height: 16,
                    boxSizing: "border-box",
                    border: "1px solid #6B6B6B",
                    background: consent ? "#111111" : "transparent",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {consent && (
                    <span style={{ color: "#c8c8c8", fontSize: 11, lineHeight: 1 }}>✓</span>
                  )}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-kr)",
                    fontSize: 15,
                    fontWeight: 400,
                    color: "#6B6B6B",
                  }}
                >
                  개인정보 수집 및 이용 동의(필수)
                </span>
              </button>
              <button type="button" onClick={() => toggle("privacy")} style={{ color: "#6B6B6B" }}>
                {open === "privacy" ? "▴" : "▾"}
              </button>
            </div>
            {open === "privacy" && (
              <div
                style={{
                  marginTop: 10,
                  border: "1px solid #555",
                  padding: "14px 16px",
                  fontFamily: "var(--font-kr)",
                  fontSize: 12,
                  lineHeight: "20px",
                  color: "#cfcfcf",
                  whiteSpace: "pre-wrap",
                }}
              >
                {settings.privacy_terms}
              </div>
            )}
          </div>
        </div>

        {/* Bottom status + CTA */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: 548,
            left: 49,
            right: 52,
            borderTop: "1px solid #3a3a3a",
            paddingTop: 22,
          }}
        >
          <div className="flex items-start justify-between gap-8">
            <div style={{ maxWidth: 620 }}>
              <div
                style={{
                  fontFamily: "var(--font-kr)",
                  fontSize: 15,
                  color: "#fff",
                  marginBottom: 10,
                }}
              >
                예약현황
              </div>
              {designer && selectedServices.length > 0 && time ? (
                <div
                  style={{
                    fontFamily: "var(--font-kr)",
                    fontSize: 13,
                    lineHeight: "22px",
                    color: "#d0d0d0",
                  }}
                >
                  <div>
                    {selectedDate.replaceAll("-", ". ")} {time} / 디자이너 {designer.name}
                  </div>
                  <div>
                    {selectedServices
                      .map((s) => `${s.name}(${formatWon(s.price)}원)`)
                      .join(" + ")}
                  </div>
                  <div style={{ marginTop: 4, color: "#fff" }}>
                    = 예약금 {formatWon(deposit)}원
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    fontFamily: "var(--font-kr)",
                    fontSize: 13,
                    color: "#777",
                  }}
                >
                  날짜 · 디자이너 · 시술 · 시간을 선택해 주세요.
                </div>
              )}
              {statusMsg && (
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "var(--font-kr)",
                    fontSize: 13,
                    color: "#cfcfcf",
                  }}
                >
                  {statusMsg}
                </div>
              )}
            </div>

            <button
              type="button"
              className="booking-cta-btn flex items-center justify-between"
              disabled={!canSubmit}
              onClick={onSubmit}
              style={{
                width: 328,
                height: 70,
                paddingLeft: 22,
                paddingRight: 22,
                fontFamily: "var(--font-kr)",
                fontSize: 15,
                fontWeight: 400,
                color: "#ffffff",
                opacity: canSubmit ? 1 : 0.45,
                cursor: canSubmit ? "pointer" : "not-allowed",
              }}
            >
              <span style={{ color: "#ffffff" }}>
                {pending ? "저장 중…" : "예약 확정 및 예약금 결제하기"}
              </span>
              <span aria-hidden style={{ color: "#ffffff" }}>
                &gt;
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
