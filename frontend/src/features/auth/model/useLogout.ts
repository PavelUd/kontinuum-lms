'use client'

import {usePathname, useRouter} from 'next/navigation'
import {removeToken} from "@/shared/lib/auth/tokenStorage";
import {useMutation} from "@tanstack/react-query";
import {logout} from "@/features/auth/api/auth.api";
import {queryClient} from "@/shared/api";

export function useLogout() {
    const router = useRouter()
    const pathname = usePathname()

    return useMutation({
        mutationFn: logout,
        onSettled: () => {
            removeToken()
            queryClient.clear()

            const redirect = pathname?.startsWith("/admin")
                ? "/admin/login"
                : "/login"

            router.push(redirect)
        }
    })
}