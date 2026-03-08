import { NextRequest, NextResponse } from "next/server"

const PUBLIC_ROUTES = [
    "/login",
    "/methodist-login"
]

export function proxy(request: NextRequest) {

    const token = request.cookies.get("access_token")?.value
    const { pathname } = request.nextUrl

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

    // нет токена → редирект на login
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // если токен есть → нельзя открывать страницы логина
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"]
}