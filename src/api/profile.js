import apiClient from './apiClient.js';
import {saveTokens} from "../utils/tokenStorage.js";

export const getProfile = async () => {
    try {
        const response = await apiClient.get('/users/me/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const updateProfile = async ({username, email}) => {
    try {
        const response = await apiClient.patch("/users/me", {
            username,
            email
        });

        const {accessToken, refreshToken} = response.data;
        saveTokens(accessToken, refreshToken);

        return response.data;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
};

export const changePassword = async ({currentPassword, newPassword}) => {
    try {
        const response = await apiClient.post("/users/me/change-password", {
            currentPassword,
            newPassword
        });

        const {accessToken, refreshToken} = response.data;
        saveTokens(accessToken, refreshToken);

        return response.data;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};
