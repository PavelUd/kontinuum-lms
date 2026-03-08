const TOKEN_KEY = "access_token"

export function saveToken(token: string) {
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400`
}

export function getToken() {

    const cookies = document.cookie.split("; ")

    const tokenCookie = cookies.find(c =>
        c.startsWith(`${TOKEN_KEY}=`)
    )

    return tokenCookie?.split("=")[1] || null
}

export function removeToken() {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`
}