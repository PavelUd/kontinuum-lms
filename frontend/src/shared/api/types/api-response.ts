export interface ApiResponse<T> {
    data: T
    succeeded: boolean
    errors: string[]
}