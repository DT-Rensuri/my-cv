import type {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from 'axios';
import type { RequestConfig } from './types';

export function setupInterceptors(http: AxiosInstance) {
    http.interceptors.request.use(
        (config: InternalAxiosRequestConfig & RequestConfig) => {
            if (!config.skipAuth) {
                const token = localStorage.getItem('access_token');

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }

            return config;
        },

        (error: AxiosError) => Promise.reject(error),
    );

    http.interceptors.response.use(
        (response) => response,

        async (error: AxiosError) => {
            const status = error.response?.status;

            if (status === 401) {
                localStorage.removeItem('access_token');
            }

            return Promise.reject(error);
        },
    );
}
