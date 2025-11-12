import apiClient from './apiClient.js';

export const getQuestionById = async (questionId) => {
    try {
        const response = await apiClient.get(`/questions/${questionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching question ${questionId}:`, error);
        throw error;
    }
};
