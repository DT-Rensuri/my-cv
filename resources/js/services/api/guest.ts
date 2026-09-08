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

    /**
     * POSTs the request and receives binary audio (or any binary payload)
     * back as a Blob instead of the JSON envelope.
     */
    async voiceStream(url: string, data?: FormData, config: RequestConfig = {}): Promise<Blob> {
        try {
            const response = await http.post<Blob>(url, data, {
                ...guestConfig,
                ...config,
                responseType: 'blob',
            });

            return response.data;
        } catch (error) {
            console.error(`Error streaming from ${url}:`, error);
            throw error;
        }
    },

    /**
     * POSTs the request and returns the raw ReadableStream of the response
     * body, so audio can be played chunk-by-chunk as it arrives (true
     * streaming) instead of waiting for the whole payload.
     */
    async voiceStreamRealtime(
        url: string,
        data?: FormData,
        config: RequestConfig = {},
    ): Promise<ReadableStream<Uint8Array>> {
        const headers: Record<string, string> = {
            Accept: 'audio/wav',
            ...(config.headers as Record<string, string> | undefined),
        };

        const response = await fetch(url, {
            method: 'POST',
            body: data,
            headers,
            credentials: 'same-origin',
        });

        if (!response.ok || !response.body) {
            throw new Error(`Stream request failed: ${response.status}`);
        }

        return response.body;
    }
};
