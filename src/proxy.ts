import { NextResponse, type NextRequest } from "next/server";
import { LANG_COOKIE, detectLocale, hasLocale } from "@/lib/i18n";

// Hosts expose the visitor's country differently; Netlify (the planned host) encodes it in x-nf-geo. ?country=TW previews a country in the demo.
function visitorCountry(request: NextRequest) {
  const preview = request.nextUrl.searchParams.get("country");
  if (preview) return preview;
  const netlify = request.headers.get("x-nf-geo");
  if (netlify) {
    try { return JSON.parse(atob(netlify)).country?.code as string | undefined; } catch { /* fall through to other hosts */ }
  }
  return request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry") ?? undefined;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (hasLocale(pathname.split("/")[1])) return NextResponse.next();
  const locale = detectLocale({ cookie: request.cookies.get(LANG_COOKIE)?.value, country: visitorCountry(request), acceptLanguage: request.headers.get("accept-language") ?? undefined });
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.searchParams.delete("country");
  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  matcher: ["/((?!_next|images|downloads|textures|icon.png|.*\\.[\\w]+$).*)"],
};
