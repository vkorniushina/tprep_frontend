import apiClient from './apiClient.js';

export const getAllModules = async () => {
    try {
        const response = await apiClient.get('/modules');
        return response.data;
    } catch (error) {
        console.error('Error fetching modules:', error);
        throw error;
    }
};