import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 минут данные считаются свежими
            gcTime: 1000 * 60 * 30,  // 30 минут хранение в кэше
            retry: 1,                // повторить запрос 1 раз при ошибке
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 0,
        },
    },
})