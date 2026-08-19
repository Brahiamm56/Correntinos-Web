import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin and perfil routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isPerfilRoute = pathname.startsWith("/perfil");

  if (isAdminRoute || isPerfilRoute) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const currentUser = session.user as typeof session.user & { role?: string };
    if (isAdminRoute && currentUser.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/perfil/:path*",
  ],
};
