export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiErrorPayload {
    error?: string
    message?: string
    errors?: unknown
    statusCode?: number
}

export class ApiError extends Error {
    public readonly status: number
    public readonly payload?: ApiErrorPayload

    constructor(message: string, status: number, payload?: ApiErrorPayload) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.payload = payload
    }
}

export interface FetchClientOptions {
    baseUrl: string
    defaultHeaders?: Record<string, string>
    withCredentials?: boolean
    getAccessToken?: () => string | null | undefined
    onUnauthorized?: () => Promise<string | null | undefined>
}

export interface RequestOptions<TBody = unknown> {
    method?: HttpMethod
    headers?: Record<string, string>
    auth?: boolean
    body?: TBody
    credentials?: RequestCredentials
    raw?: boolean
    query?: Record<string, string | number | boolean | null | undefined>
}

export class FetchClient {
    private readonly baseUrl: string
    private readonly defaultHeaders: Record<string, string>
    private readonly withCredentials: boolean
    private readonly getAccessToken?: () => string | null | undefined
    private readonly onUnauthorized?: () => Promise<string | null | undefined>

    constructor(options: FetchClientOptions) {
        this.baseUrl = options.baseUrl.endsWith('/')
            ? options.baseUrl
            : `${options.baseUrl}/`
        this.defaultHeaders = options.defaultHeaders ?? {}
        this.withCredentials = options.withCredentials ?? true
        this.getAccessToken = options.getAccessToken
        this.onUnauthorized = options.onUnauthorized
    }

    get<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
        return this.request<T>(path, { ...options, method: 'GET' })
    }

    post<T, TBody = unknown>(
        path: string,
        body?: TBody,
        options?: Omit<RequestOptions<TBody>, 'method' | 'body'>
    ): Promise<T> {
        return this.request<T, TBody>(path, { ...options, method: 'POST', body })
    }

    put<T, TBody = unknown>(
        path: string,
        body?: TBody,
        options?: Omit<RequestOptions<TBody>, 'method' | 'body'>
    ): Promise<T> {
        return this.request<T, TBody>(path, { ...options, method: 'PUT', body })
    }

    patch<T, TBody = unknown>(
        path: string,
        body?: TBody,
        options?: Omit<RequestOptions<TBody>, 'method' | 'body'>
    ): Promise<T> {
        return this.request<T, TBody>(path, { ...options, method: 'PATCH', body })
    }

    delete<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
        return this.request<T>(path, { ...options, method: 'DELETE' })
    }

    async request<TResponse, TBody = unknown>(
        path: string,
        options: RequestOptions<TBody> = {}
    ): Promise<TResponse> {
        const url = this.buildUrl(path, options.query)
        const credentials =
            options.credentials ?? (this.withCredentials ? 'include' : 'same-origin')

        const makeInit = (token?: string | null): RequestInit => {
            const headers: Record<string, string> = {
                ...this.defaultHeaders,
                ...options.headers,
            }

            // JSON по умолчанию, если есть body
            const hasBody =
                options.body !== undefined &&
                options.body !== null &&
                options.method !== 'GET' &&
                options.method !== 'DELETE'

            if (hasBody) {
                // Если пользователь сам не указал Content-Type, ставим JSON
                if (!Object.keys(headers).some((h) => h.toLowerCase() === 'content-type')) {
                    headers['Content-Type'] = 'application/json'
                }
            }

            if (options.auth) {
                const accessToken = token ?? this.getAccessToken?.()
                if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
            }

            return {
                method: options.method ?? 'GET',
                credentials,
                headers,
                body: hasBody ? JSON.stringify(options.body) : undefined,
            }
        }

        // 1-я попытка
        let response = await fetch(url, makeInit(null))

        // Если 401 и есть onUnauthorized — пробуем обновить токен и повторить 1 раз
        if (response.status === 401 && options.auth && this.onUnauthorized) {
            const newToken = await this.onUnauthorized()
            if (newToken) {
                response = await fetch(url, makeInit(newToken))
            }
        }

        if (options.raw) {
            return response as unknown as TResponse
        }

        // Пытаемся распарсить JSON, но корректно обрабатываем пустой ответ
        const text = await response.text()
        const data = text ? safeJsonParse(text) : null

        if (!response.ok) {
            const message =
                (data && (data.error || data.message)) ||
                `HTTP ${response.status} ${response.statusText}`
            throw new ApiError(String(message), response.status, data ?? undefined)
        }

        return (data as TResponse) ?? (null as unknown as TResponse)
    }

    private buildUrl(
        path: string,
        query?: Record<string, string | number | boolean | null | undefined>
    ): string {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path
        const url = new URL(cleanPath, this.baseUrl)

        if (query) {
            for (const [key, value] of Object.entries(query)) {
                if (value === null || value === undefined) continue
                url.searchParams.set(key, String(value))
            }
        }

        return url.toString()
    }
}

function safeJsonParse(text: string): any {
    try {
        return JSON.parse(text)
    } catch {
        return { message: text }
    }
}