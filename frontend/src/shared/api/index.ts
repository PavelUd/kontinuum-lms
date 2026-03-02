import { FetchClient } from './fetchClient'
import { queryClient } from './queryClient'


export const api = new FetchClient({
    baseUrl: 'http://localhost:5211/api/',
    withCredentials: true,
})

export { FetchClient }
export { queryClient }
export * from './fetchClient'