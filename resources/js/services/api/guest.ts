import { http } from '@/services/http';
import type { ApiResponse, RequestConfig } from '@/services/http/types';

const guestConfig: RequestConfig = {
    skipAuth: true,
};

async function handleRequest<T>(
    request: () => Promise<{ data: ApiResponse<T> }>,
): Promise<ApiResponse<T>> {
    try {
        const response = await request();
        if (!response.data.success) {
            throw new Error(response.data.message || 'An error occurred');
        }
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const guestApi = {
    get<T>(url: string, config: RequestConfig = {}) {
        return handleRequest<T>(() =>
            http.get<ApiResponse<T>>(url, {
                ...guestConfig,
                ...config,
            }),
        );
    },

    post<T>(url: string, data?: FormData, config: RequestConfig = {}) {
        return handleRequest<T>(() =>
            http.post<ApiResponse<T>>(url, data, {
                ...guestConfig,
                ...config,
            }),
        );
    },

    put<T>(url: string, data?: FormData, config: RequestConfig = {}) {
        return handleRequest<T>(() =>
            http.put<ApiResponse<T>>(url, data, {
                ...guestConfig,
                ...config,
            }),
        );
    },

    patch<T>(url: string, data?: FormData, config: RequestConfig = {}) {
        return handleRequest<T>(() =>
            http.patch<ApiResponse<T>>(url, data, {
                ...guestConfig,
                ...config,
            }),
        );
    },

    delete<T>(url: string, config: RequestConfig = {}) {
        return handleRequest<T>(() =>
            http.delete<ApiResponse<T>>(url, {
                ...guestConfig,
                ...config,
            }),
        );
    },
};
