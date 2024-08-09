export interface Paginate<T> {
    data: T;
    totalRows: number;
    page: number;
}