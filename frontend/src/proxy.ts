import { NextRequest, NextResponse } from "next/server"

const PUBLIC_ROUTES = [
    "/login",
    "/admin/login"
]

export function proxy(request: NextRequest) {

    const token = request.cookies.get("refresh_token")?.value
    const { pathname } = request.nextUrl

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
    const isAdminRoute = pathname.startsWith("/admin")

    if (!token && !isPublicRoute) {

        const loginPath = isAdminRoute
            ? "/admin/login"
            : "/login"

        return NextResponse.redirect(new URL(loginPath, request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"]
}