import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(
  identifier: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= limit) {
    return true;
  }

  entry.count += 1;
  return false;
}

export const updateSession = async (request: NextRequest) => {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const path = request.nextUrl.pathname;

  if (path.startsWith("/login") || path.startsWith("/signup")) {
    const isLimited = isRateLimited(`auth:${ip}`, 10, 60 * 1000);
    if (isLimited && request.method === "POST") {
      return NextResponse.json(
        {
          error:
            "Terlalu banyak mencoba login/daftar. Istirahat dulu 1 menit ya!",
        },
        { status: 429 }
      );
    }
  }

  if (path.startsWith("/api/")) {
    const isLimited = isRateLimited(`api:${ip}`, 60, 60 * 1000);
    if (isLimited) {
      return NextResponse.json(
        {
          error:
            "Waduh, pelan-pelan bro! Terlalu banyak klik dalam waktu singkat. Tunggu sebentar ya.",
        },
        { status: 429 }
      );
    }
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    path.startsWith("/login") || path.startsWith("/signup");

  if (!user && !isAuthPage && !path.startsWith("/api")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
};
