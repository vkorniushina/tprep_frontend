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
