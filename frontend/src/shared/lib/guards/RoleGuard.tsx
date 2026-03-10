"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {useAuth} from "@/shared/lib/auth/AuthProvider";

interface Props {
    roles: string[]
    children: React.ReactNode
}

export function RoleGuard({ roles, children }: Props) {
    const { role, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && role && !roles.includes(role)) {
            router.replace("/")
        }
    }, [role, loading])

    if (loading) return null

    if (!role || !roles.includes(role)) {
        return null
    }

    return <>{children}</>
}