import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
} from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const API_PREFIX =
    import.meta.env.VITE_API_PREFIX || '/api';

const baseURL = `${API_BASE_URL.replace(/\/+$/, '')}/${API_PREFIX.replace(/^\/+/, '')}`;

export const http: AxiosInstance = axios.create({
    baseURL,

    timeout: 30_000,

    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },

    withCredentials: true,
});

export { AxiosError };
export type {
    AxiosRequestConfig,
    AxiosResponse,
};