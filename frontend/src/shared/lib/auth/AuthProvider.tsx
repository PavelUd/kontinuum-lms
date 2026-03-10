'use client'

import {createContext, ReactNode, useContext, useEffect} from "react"
import { useQuery } from "@tanstack/react-query"
import {getToken, parseJwt, saveToken} from "@/shared/lib/auth/tokenStorage";
import {ApiResponse} from "@/shared/api/types/api-response";
import {refresh} from "@/shared/api/auth/refresh";
import {usePathname, useRouter} from "next/navigation"
import {Loader} from "@/shared/ui/loader";

export const AuthContext = createContext<AuthContextType | null>(null)

type Props = {
    children: ReactNode
}

export function AuthProvider({ children }: Props) {
    const pathname = usePathname()
    const router = useRouter()
    const isPublicRoute =
        pathname === "/login" ||
        pathname === "/admin/login"

    const { data, isLoading, isError } = useQuery<ApiResponse<string>>({
        queryKey: ["auth"],
        queryFn: refresh,
        retry: false
    })

    useEffect(() => {
        if(isError && !isPublicRoute){
            router.replace("/login")
        }
        else if (data?.data) {
            saveToken(data.data)
        }
    }, [isError, data])


    const user = parseJwt(data?.data ?? "")
    const value: AuthContextType = {
        user: user?.id ?? null,
        role: user?.role ?? null,
        loading: isLoading
    }

    if (!isPublicRoute && (isLoading || isError)) {
        return <Loader/>
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth () : AuthContextType {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }

    return context
}