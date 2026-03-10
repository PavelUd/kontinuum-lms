type AuthContextType = {
    user: string | null
    role: string | null
    loading: boolean
}

type JwtPayload = {
    sub?: string
    id?: string
    role?: string
    exp?: number
}