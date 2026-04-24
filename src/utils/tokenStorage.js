const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const saveAccessToken = (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const saveRefreshToken = (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token);
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);

export const saveTokens = (accessToken, refreshToken) => {
    saveAccessToken(accessToken);
    saveRefreshToken(refreshToken);
};

export const removeTokens = () => {
    removeAccessToken();
    removeRefreshToken();
};

export const isAuthenticated = () => !!getAccessToken();
