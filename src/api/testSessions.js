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

export const startWrongTestSession = async (sessionId) => {
    try {
        const response = await apiClient.post(`/test-sessions/start-wrong/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error starting wrong answers session ${sessionId}:`, error);
        throw error;
    }
};

export const createSharedTestSession = async (shareToken, testId) => {
    try {
        const response = await apiClient.post(`/test-sessions/share/${shareToken}`, {
            testId: testId
        });
        return response.data;
    } catch (error) {
        console.error(`Error creating shared session for token ${shareToken}:`, error);
        throw error;
    }
};

export const submitSharedAnswer = async (shareToken, sessionId, answerData) => {
    try {
        const response = await apiClient.post(`/test-sessions/share/${shareToken}/${sessionId}/answers`, answerData);
        return response.data;
    } catch (error) {
        console.error(`Error submitting shared answer for session ${sessionId}:`, error);
        throw error;
    }
};

export const finishSharedTestSession = async (shareToken, sessionId) => {
    try {
        const response = await apiClient.post(`/test-sessions/share/${shareToken}/${sessionId}/finish`);
        return response.data;
    } catch (error) {
        console.error(`Error finishing shared session ${sessionId}:`, error);
        throw error;
    }
};

export const startSharedWrongTestSession = async (shareToken, sessionId) => {
    try {
        const response = await apiClient.post(`/test-sessions/share/${shareToken}/${sessionId}/start-wrong`);
        return response.data;
    } catch (error) {
        console.error(`Error starting shared wrong answers session ${sessionId}:`, error);
        throw error;
    }
};
