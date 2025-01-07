export interface QueryResponse<T> {
    message: string
    data: T
}

export interface MutationResponse<T = unknown> {
    message: string
    data?: T
}
