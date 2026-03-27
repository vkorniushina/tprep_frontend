import apiClient from './apiClient.js';

export const getProfile = async () => {
    try {
        const response = await apiClient.get('/users/me/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};
