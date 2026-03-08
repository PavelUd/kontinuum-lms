'use client'

import { useRouter } from 'next/navigation'
import {removeToken} from "@/shared/api/auth/tokenStorage";

export function useLogout() {
    const router = useRouter()

    const logout = () => {
        removeToken()
        router.push('/methodist-login')
    }

    return logout
}