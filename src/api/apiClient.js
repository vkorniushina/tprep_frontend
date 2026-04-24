import axios from 'axios';
import {
    getAccessToken,
    getRefreshToken,
    saveTokens,
    removeTokens
} from '../utils/tokenStorage.js';
import {refreshTokens} from "./auth.js";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                removeTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const data = await refreshTokens(refreshToken);

                const {accessToken, refreshToken: newRefreshToken} = data;
                saveTokens(accessToken, newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);

                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                removeTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
