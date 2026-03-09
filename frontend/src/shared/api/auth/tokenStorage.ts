const TOKEN_KEY = "access_token"

let accessToken: string | null = null

export function saveToken(token: string) {
    accessToken = token
}

export function getToken(): string | null {
    return accessToken
}

export function removeToken() {
    accessToken = null
}

export function parseJwt(token: string): JwtPayload | null {
    try {
        const payload = token.split('.')[1]
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        return JSON.parse(decoded)
    } catch {
        return null
    }
}