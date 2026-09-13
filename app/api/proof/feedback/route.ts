import { NextResponse } from "next/server";

// Privacy-safe feedback endpoint: accepts only a boolean and a normalized page path.
// It intentionally does not receive chat text, visitor identity, IP data, or cookies.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { helpful?: unknown; page?: unknown };
  const helpful = typeof body.helpful === "boolean" ? body.helpful : null;
  const page = typeof body.page === "string" && /^\/[a-z0-9/?=&._-]*$/i.test(body.page) ? body.page : "/";
  if (helpful === null) return NextResponse.json({ ok: false }, { status: 400 });
  return NextResponse.json({ ok: true, helpful, page }, { headers: { "cache-control": "no-store" } });
}
