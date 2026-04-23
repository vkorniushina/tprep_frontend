import apiClient from './apiClient.js';

export const getReminders = async () => {
    try {
        const response = await apiClient.get('/reminders');
        return response.data;
    } catch (error) {
        console.error('Error fetching reminders:', error);
        throw error;
    }
};

export const getModulesShort = async () => {
    try {
        const response = await apiClient.get('/modules/short');
        return response.data;
    } catch (error) {
        console.error('Error fetching modules short:', error);
        throw error;
    }
};

export const createReminders = async (body) => {
    try {
        const response = await apiClient.post('/reminders', body);
        return response.data;
    } catch (error) {
        console.error('Error creating reminders:', error);
        throw error;
    }
};

export const updateReminders = async (testId, body) => {
    try {
        const response = await apiClient.put(`/reminders/${testId}`, body);
        return response.data;
    } catch (error) {
        console.error(`Error updating reminders for test ${testId}:`, error);
        throw error;
    }
};

export const deleteReminders = async (testId) => {
    try {
        const response = await apiClient.delete(`/reminders/${testId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting reminders for test ${testId}:`, error);
        throw error;
    }
};
