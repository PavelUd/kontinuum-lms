'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/api/queryClient'
import {AuthProvider} from "@/shared/lib/auth/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
        </AuthProvider>
        </QueryClientProvider>
    )
}