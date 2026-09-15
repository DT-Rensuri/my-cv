import type { AxiosRequestConfig } from 'axios';

/**
 * Standard API response envelope returned by the backend.
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: number;
}

/**
 * Axios request config extended with app-specific options.
 */
export interface RequestConfig extends AxiosRequestConfig {
    /** Skip attaching the Authorization header for this request. */
    skipAuth?: boolean;
}