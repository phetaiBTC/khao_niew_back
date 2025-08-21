export interface Pagination<T> {
    data: T[]
    pagination: {
        page: number
        per_page: number
        total: number
        total_pages: number
    }
}