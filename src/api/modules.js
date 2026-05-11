import apiClient from './apiClient.js';

export const getAllModules = async ({ page = 0, size = 6}) => {
    try {
        const response = await apiClient.get('/modules', {
            params: {
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching modules:', error);
        throw error;
    }
};

export const searchModules = async ({ keyword, page = 0, size = 6 }) => {
    try {
        const response = await apiClient.get('/modules/search', {
            params: {
                keyWord: keyword,
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching modules:', error);
        throw error;
    }
};

export const getPublicModules = async ({ page = 0, size = 6, keyword }) => {
    try {
        const response = await apiClient.get('/modules/public', {
            params: {
                page,
                size,
                keyword: keyword
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching public modules:', error);
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

export const getModuleQuestionsLight = async (id) => {
    try {
        const response = await apiClient.get(`/modules/${id}/questions?light=true`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching light questions for module ${id}:`, error);
        throw error;
    }
};

export const updateModule = async (id, body) => {
    try {
        const response = await apiClient.put(`/modules/${id}`, body);
        return response.data;
    } catch (error) {
        console.error(`Error updating module ${id}:`, error);
        throw error;
    }
};

export const createModuleManual = async (body) => {
    try {
        const response = await apiClient.post('/modules', body);
        return response.data;
    } catch (error) {
        console.error('Error creating module:', error);
        throw error;
    }
};

export const createModuleByFile = async (formData) => {
    try {
        const response = await apiClient.post('/modules/upload', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating module from file:', error);
        throw error;
    }
};

export const deleteModule = async (id) => {
    try {
        const response = await apiClient.delete(`/modules/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting module ${id}:`, error);
        throw error;
    }
};

export const updateModuleAccess = async (id, accessMode) => {
    try {
        const response = await apiClient.put(`/modules/${id}/access`, {accessMode});
        return response.data;
    } catch (error) {
        console.error(`Error updating access for module ${id}:`, error);
        throw error;
    }
};

export const getModuleByToken = async (shareToken) => {
    try {
        const response = await apiClient.get(`/modules/share/${shareToken}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching module by token ${shareToken}:`, error);
        throw error;
    }
};

export const getModuleQuestionsByToken = async (shareToken) => {
    try {
        const response = await apiClient.get(`/modules/share/${shareToken}/questions`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching questions by token ${shareToken}:`, error);
        throw error;
    }
};

export const getModuleQuestionsLightByToken = async (shareToken) => {
    try {
        const response = await apiClient.get(`/modules/share/${shareToken}/questions`, {
            params: { light: true }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching light questions by token ${shareToken}:`, error);
        throw error;
    }
};

export const getQuestionByToken = async (shareToken, questionId) => {
    try {
        const response = await apiClient.get(`/modules/share/${shareToken}/${questionId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching question ${questionId} by token ${shareToken}:`, error);
        throw error;
    }
};

