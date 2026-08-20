import { http } from '@/services/http';
import type { ApiResponse, RequestConfig } from '@/services/http/types';

const authConfig: RequestConfig = {
    skipAuth: false,
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

export const authApi = {
    get<T>(url: string, config: RequestConfig = {}) {
        return handleRequest<T>(() =>
            http.get<ApiResponse<T>>(url, {
                ...authConfig,
                ...config,
            }),
        );
    },

    post<T>(url: string, data?: FormData, config: RequestConfig = {}) {
        return handleRequest<T>(() =>
            http.post<ApiResponse<T>>(url, data, {
                ...authConfig,
                ...config,
            }),
        );
    },

    put<T>(url: string, data?: FormData, config: RequestConfig = {}) {
        return handleRequest<T>(() =>
            http.put<ApiResponse<T>>(url, data, {
                ...authConfig,
                ...config,
            }),
        );
    },

    patch<T>(url: string, data?: FormData, config: RequestConfig = {}) {
        return handleRequest<T>(() =>
            http.patch<ApiResponse<T>>(url, data, {
                ...authConfig,
                ...config,
            }),
        );
    },

    delete<T>(url: string, config: RequestConfig = {}) {
        return handleRequest<T>(() =>
            http.delete<ApiResponse<T>>(url, {
                ...authConfig,
                ...config,
            }),
        );
    },
};
