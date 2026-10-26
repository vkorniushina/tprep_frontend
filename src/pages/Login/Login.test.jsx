import React from 'react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import Login from './Login.jsx';
import {signIn} from '../../api/auth.js';

vi.mock('../../api/auth.js', () => ({
    signIn: vi.fn(),
}));

const renderLogin = () => {
    return render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<div>Главная страница</div>}/>
                <Route path="/register" element={<div>Страница регистрации</div>}/>
            </Routes>
        </MemoryRouter>
    );
};

describe('Login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render login form', () => {
        renderLogin();

        expect(screen.getByText('T-Prep')).toBeInTheDocument();
        expect(screen.getByText('Вход в аккаунт')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Войти'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Зарегистрироваться'})).toBeInTheDocument();
    });

    it('should show validation errors and not call signIn when form is empty', async () => {
        const user = userEvent.setup();

        renderLogin();

        await user.click(screen.getByRole('button', {name: 'Войти'}));

        expect(signIn).not.toHaveBeenCalled();
        expect(screen.getAllByText('Обязательное поле').length).toBeGreaterThanOrEqual(2);
    });

    it('should call signIn and navigate to main page after successful login', async () => {
        const user = userEvent.setup();

        signIn.mockResolvedValueOnce({});

        renderLogin();

        await user.type(screen.getByPlaceholderText('E-mail'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Пароль'), 'password123');
        await user.click(screen.getByRole('button', {name: 'Войти'}));

        await waitFor(() => {
            expect(signIn).toHaveBeenCalledWith('test@example.com', 'password123');
        });

        expect(await screen.findByText('Главная страница')).toBeInTheDocument();
    });

    it('should show auth error when server returns 401', async () => {
        const user = userEvent.setup();

        signIn.mockRejectedValueOnce({
            response: {
                status: 401,
            },
        });

        renderLogin();

        await user.type(screen.getByPlaceholderText('E-mail'), 'wrong@example.com');
        await user.type(screen.getByPlaceholderText('Пароль'), 'wrongpass');
        await user.click(screen.getByRole('button', {name: 'Войти'}));

        expect(await screen.findByText('Неверный email или пароль')).toBeInTheDocument();
    });

    it('should show server error when server returns 500', async () => {
        const user = userEvent.setup();

        signIn.mockRejectedValueOnce({
            response: {
                status: 500,
            },
        });

        renderLogin();

        await user.type(screen.getByPlaceholderText('E-mail'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Пароль'), 'password123');
        await user.click(screen.getByRole('button', {name: 'Войти'}));

        expect(await screen.findByText('Ошибка сервера. Попробуйте позже')).toBeInTheDocument();
    });

    it('should show connection error for unknown login error', async () => {
        const user = userEvent.setup();

        signIn.mockRejectedValueOnce(new Error('Network error'));

        renderLogin();

        await user.type(screen.getByPlaceholderText('E-mail'), 'test@example.com');
        await user.type(screen.getByPlaceholderText('Пароль'), 'password123');
        await user.click(screen.getByRole('button', {name: 'Войти'}));

        expect(await screen.findByText('Ошибка входа. Проверьте соединение')).toBeInTheDocument();
    });

    it('should navigate to register page when register button is clicked', async () => {
        const user = userEvent.setup();

        renderLogin();

        await user.click(screen.getByRole('button', {name: 'Зарегистрироваться'}));

        expect(screen.getByText('Страница регистрации')).toBeInTheDocument();
    });
});
