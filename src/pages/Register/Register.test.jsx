import React from 'react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes, useLocation} from 'react-router-dom';
import Register from './Register.jsx';
import {sendVerificationCode} from '../../api/auth.js';

vi.mock('../../api/auth.js', () => ({
    sendVerificationCode: vi.fn(),
}));

const VerifyEmailPageStub = () => {
    const location = useLocation();

    return (
        <div>
            <div>Страница подтверждения email</div>
            <div>Email: {location.state?.email}</div>
            <div>Name: {location.state?.name}</div>
            <div>Password: {location.state?.password}</div>
        </div>
    );
};

const renderRegister = () => {
    return render(
        <MemoryRouter initialEntries={['/register']}>
            <Routes>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<div>Страница входа</div>}/>
                <Route path="/verify-email" element={<VerifyEmailPageStub/>}/>
            </Routes>
        </MemoryRouter>
    );
};

describe('Register', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render register form', () => {
        renderRegister();

        expect(screen.getByText('T-Prep')).toBeInTheDocument();
        expect(screen.getByText('Создайте аккаунт')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Имя')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Повторите пароль')).toBeInTheDocument();
        expect(screen.getByText('Я принимаю условия использования и политику конфиденциальности')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Зарегистрироваться'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Войти'})).toBeInTheDocument();
    });

    it('should show validation errors and not call sendVerificationCode when form is empty', async () => {
        const user = userEvent.setup();

        renderRegister();

        await user.click(screen.getByRole('button', {name: 'Зарегистрироваться'}));

        expect(sendVerificationCode).not.toHaveBeenCalled();
        expect(screen.getAllByText('Обязательное поле').length).toBeGreaterThanOrEqual(3);
    });

    it('should show password confirmation error when passwords do not match', async () => {
        const user = userEvent.setup();

        renderRegister();

        await user.type(screen.getByPlaceholderText('Имя'), 'Вероника');
        await user.type(screen.getByPlaceholderText('E-mail'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Пароль'), 'StrongPassword123');
        await user.type(screen.getByPlaceholderText('Повторите пароль'), 'AnotherPassword123');

        await user.click(screen.getByRole('button', {name: 'Зарегистрироваться'}));

        expect(sendVerificationCode).not.toHaveBeenCalled();

        expect(screen.getByText(/пароли не совпадают/i)).toBeInTheDocument();
    });

    it('should send verification code and navigate to email verification page after successful registration step', async () => {
        const user = userEvent.setup();
        sendVerificationCode.mockResolvedValueOnce({});

        renderRegister();

        await user.type(screen.getByPlaceholderText('Имя'), 'Вероника');
        await user.type(screen.getByPlaceholderText('E-mail'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Пароль'), 'StrongPassword123');
        await user.type(screen.getByPlaceholderText('Повторите пароль'), 'StrongPassword123');

        await user.click(screen.getByRole('button', {name: 'Зарегистрироваться'}));

        await waitFor(() => {
            expect(sendVerificationCode).toHaveBeenCalledWith('test@example.com');
        });

        expect(await screen.findByText('Страница подтверждения email')).toBeInTheDocument();
        expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Name: Вероника')).toBeInTheDocument();
        expect(screen.getByText('Password: StrongPassword123')).toBeInTheDocument();
    });

    it('should show server error when sendVerificationCode returns 500', async () => {
        const user = userEvent.setup();

        sendVerificationCode.mockRejectedValueOnce({
            response: {
                status: 500,
            },
        });

        renderRegister();

        await user.type(screen.getByPlaceholderText('Имя'), 'Вероника');
        await user.type(screen.getByPlaceholderText('E-mail'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Пароль'), 'StrongPassword123');
        await user.type(screen.getByPlaceholderText('Повторите пароль'), 'StrongPassword123');

        await user.click(screen.getByRole('button', {name: 'Зарегистрироваться'}));

        expect(await screen.findByText('Ошибка сервера. Попробуйте позже')).toBeInTheDocument();
    });

    it('should show connection error when sendVerificationCode fails without 500 status', async () => {
        const user = userEvent.setup();

        sendVerificationCode.mockRejectedValueOnce(new Error('Network error'));

        renderRegister();

        await user.type(screen.getByPlaceholderText('Имя'), 'Вероника');
        await user.type(screen.getByPlaceholderText('E-mail'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Пароль'), 'StrongPassword123');
        await user.type(screen.getByPlaceholderText('Повторите пароль'), 'StrongPassword123');

        await user.click(screen.getByRole('button', {name: 'Зарегистрироваться'}));

        expect(await screen.findByText('Ошибка регистрации. Проверьте соединение')).toBeInTheDocument();
    });

    it('should navigate to login page when login button is clicked', async () => {
        const user = userEvent.setup();

        renderRegister();

        await user.click(screen.getByRole('button', {name: 'Войти'}));

        expect(screen.getByText('Страница входа')).toBeInTheDocument();
    });
});
