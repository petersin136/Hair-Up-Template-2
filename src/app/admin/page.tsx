import Link from "next/link";

/** Placeholder admin entry — auth / dashboard later. */
export default function AdminPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1
        className="uppercase"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: 40,
          letterSpacing: "0.08em",
        }}
      >
        ADMIN
      </h1>
      <p
        className="mt-4"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          color: "#9a9a9a",
        }}
      >
        관리자 페이지는 준비 중입니다.
      </p>
      <Link
        href="/"
        className="mt-10 text-sm tracking-widest uppercase transition-opacity hover:opacity-55"
        style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.12em" }}
      >
        ← Back to site
      </Link>
    </main>
  );
}
