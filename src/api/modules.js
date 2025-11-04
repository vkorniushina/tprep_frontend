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

export const getModuleById = async (id) => {
    try {
        const response = await apiClient.get(`/modules/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching module ${id}:`, error);
        throw error;
    }
};

export const getModuleQuestions = async (id) => {
    try {
        const response = await apiClient.get(`/modules/${id}/questions`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching questions for module ${id}:`, error);
        throw error;
    }
};