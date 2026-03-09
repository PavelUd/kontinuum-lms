'use client'

import {createContext, ReactNode, useContext, useEffect} from "react"
import { useQuery } from "@tanstack/react-query"
import {parseJwt, saveToken} from "@/shared/api/auth/tokenStorage";
import {ApiResponse} from "@/shared/api/types/api-response";
import {refresh} from "@/shared/api/auth/refresh";
import {Loader} from "@/shared/ui/loader";

export const AuthContext = createContext<AuthContextType | null>(null)

type Props = {
    children: ReactNode
}

export function AuthProvider({ children }: Props) {

    const { data, isLoading } = useQuery<ApiResponse<string>>({
        queryKey: ["auth"],
        queryFn: refresh,
        retry: false
    })

    useEffect(() => {
        if (data?.data) {
            saveToken(data.data)
        }
    }, [data])


    const user = parseJwt(data?.data ?? "")
    const value: AuthContextType = {
        user: user?.id ?? null,
        role: user?.role ?? null,
        loading: isLoading
    }

    if(isLoading) {
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