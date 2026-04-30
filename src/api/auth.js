import apiClient from './apiClient.js';
import axios from "axios";
import {saveTokens} from '../utils/tokenStorage.js';

export const sendVerificationCode = async (email) => {
    try {
        const response = await apiClient.post('/auth/send-code', null, {
            params: {email},
            headers: {'Content-Type': undefined}
        });
        return response.data;
    } catch (error) {
        console.error('Error sending verification code:', error);
        throw error;
    }
};

export const verifyEmail = async (email, code) => {
    try {
        const response = await apiClient.post('/auth/verify', {email, code});
        return response.data;
    } catch (error) {
        console.error('Error verifying email:', error);
        throw error;
    }
};

export const signUp = async (username, email, password) => {
    try {
        const response = await apiClient.post('/auth/sign-up', {
            username,
            email,
            password
        });

        const {accessToken, refreshToken} = response.data;
        saveTokens(accessToken, refreshToken);

        return response.data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
};

export const signIn = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/sign-in', {email, password});

        const {accessToken, refreshToken} = response.data;
        saveTokens(accessToken, refreshToken);

        return response.data;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

export const refreshTokens = async (refreshToken) => {
    const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/auth/refresh`,
        {refreshToken}
    );
    return response.data;
};
