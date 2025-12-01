import apiClient from './apiClient.js';

export const createTestSession = async (testId) => {
    try {
        const response = await apiClient.post('/test-sessions', {testId});
        return response.data;
    } catch (error) {
        console.error('Error creating test session:', error);
        throw error;
    }
};

export const submitAnswer = async (sessionId, answerData) => {
    try {
        const response = await apiClient.post(`/test-sessions/${sessionId}/answers`, answerData);
        return response.data;
    } catch (error) {
        console.error(`Error submitting answer for session ${sessionId}:`, error);
        throw error;
    }
};

export const getTestSession = async (sessionId) => {
    try {
        const response = await apiClient.get(`/test-sessions/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching test session ${sessionId}:`, error);
        throw error;
    }
};

export const finishTestSession = async (sessionId) => {
    try {
        const response = await apiClient.post(`/test-sessions/${sessionId}/finish`);
        return response.data;
    } catch (error) {
        console.error(`Error finishing test session ${sessionId}:`, error);
        throw error;
    }
};
