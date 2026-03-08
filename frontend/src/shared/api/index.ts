import { getToken } from "./auth/tokenStorage"
import { FetchClient } from './fetchClient'
import { queryClient } from './queryClient'


export const api = new FetchClient({
    baseUrl: 'http://localhost:5211/api/',
    getAccessToken: () => getToken(),
    withCredentials: true,
})

export { FetchClient }
export { queryClient }
export * from './fetchClient'