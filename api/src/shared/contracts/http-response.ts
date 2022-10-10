export interface HttpResponse<T = any> {
    message: T;
    status: number;
}