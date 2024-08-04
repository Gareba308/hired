import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const adminPath = req.nextUrl.pathname.startsWith("/control");
  const employerPath = req.nextUrl.pathname.startsWith("/manage");
  const workerPath = /^\/site(\/|$)/.test(req.nextUrl.pathname);
  const newUserPath = req.nextUrl.pathname.startsWith("/assign");

  const requestHeaders = new Headers(req.headers);
  const ip = req.ip || "";

  const location = req.geo?.city || "Unknown";

  requestHeaders.set("x-forwarded-for", ip);

  requestHeaders.set("x-city", location);
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const admin = token?.role === "admin";
  const employer = token?.role === "employer";
  const worker = token?.role === "worker";
  const newUser = token?.role === "new";

  if (!admin && adminPath) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (admin && !adminPath) {
    return NextResponse.redirect(new URL("/control", req.url));
  } else if (!employer && employerPath) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (employer && !employerPath) {
    return NextResponse.redirect(new URL("/manage", req.url));
  } else if (!worker && workerPath) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (worker && !workerPath) {
    return NextResponse.redirect(new URL("/site", req.url));
  } else if (!newUser && newUserPath) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (newUser && !newUserPath) {
    return NextResponse.redirect(new URL("/assign", req.url));
  }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)(.+)"],
};