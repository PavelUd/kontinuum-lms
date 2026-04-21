"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {useAuth} from "@/shared/lib/auth/AuthProvider";
import {Role} from "@/entities/user/models/types";

interface Props {
    roles: Role[]
    children: React.ReactNode
}

export function RoleGuard({ roles, children }: Props) {
    const { role, loading } = useAuth()
    const router = useRouter()
    useEffect(() => {
        if (!loading && role && !roles.includes(role.toLowerCase() as Role)) {
            router.replace("/")
        }
    }, [role, loading])

    if (loading) return null

    if (!role || !roles.includes(role.toLowerCase() as Role)) {
        return null
    }

    return <>{children}</>
}