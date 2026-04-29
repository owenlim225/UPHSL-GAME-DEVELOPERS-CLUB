import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;

type Entry = { count: number; windowStart: number };

const globalState = globalThis as typeof globalThis & {
  __gdcRateLimit?: Map<string, Entry>;
};

const rateMap = globalState.__gdcRateLimit ?? new Map<string, Entry>();
globalState.__gdcRateLimit = rateMap;
const DEBUG_ENDPOINT =
  "http://127.0.0.1:7354/ingest/80fda280-b937-4af2-be3a-52af5cf0eba5";
const DEBUG_SESSION_ID = "386c92";

function makeKey(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  return `${ip}:${request.nextUrl.pathname}`;
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.searchParams.get("debugProbe") === "386c92") {
    // #region agent log
    fetch(DEBUG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": DEBUG_SESSION_ID,
      },
      body: JSON.stringify({
        sessionId: DEBUG_SESSION_ID,
        runId: `server-${Date.now()}`,
        hypothesisId: "H5",
        location: "middleware.ts:28",
        message: "Server middleware debug probe received request",
        data: {
          pathname: request.nextUrl.pathname,
          hasUserAgent: Boolean(request.headers.get("user-agent")),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }

  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const key = makeKey(request);
  const now = Date.now();
  const existing = rateMap.get(key);
  if (!existing || now - existing.windowStart > WINDOW_MS) {
    rateMap.set(key, { count: 1, windowStart: now });
    return NextResponse.next();
  }
  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json(
      { success: false, data: null, error: "Rate limit exceeded" },
      { status: 429 },
    );
  }
  rateMap.set(key, { ...existing, count: existing.count + 1 });
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};

