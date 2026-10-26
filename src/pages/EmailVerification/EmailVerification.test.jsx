import React from 'react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen, waitFor, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import EmailVerification from './EmailVerification.jsx';
import {sendVerificationCode, signUp, verifyEmail} from '../../api/auth.js';

vi.mock('../../api/auth.js', () => ({
    sendVerificationCode: vi.fn(),
    signUp: vi.fn(),
    verifyEmail: vi.fn(),
}));

const renderEmailVerification = (state = {
    email: 'test@example.com',
    password: 'StrongPassword123',
    name: 'Вероника',
}) => {
    return render(
        <MemoryRouter initialEntries={[{pathname: '/verify-email', state}]}>
            <Routes>
                <Route path="/verify-email" element={<EmailVerification/>}/>
                <Route path="/register" element={<div>Страница регистрации</div>}/>
                <Route path="/" element={<div>Главная страница</div>}/>
            </Routes>
        </MemoryRouter>
    );
};

describe('EmailVerification', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should render verification page with user email', () => {
        renderEmailVerification();

        expect(screen.getByText('T-Prep')).toBeInTheDocument();
        expect(screen.getByText('Введите код')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Код')).toBeInTheDocument();
        expect(screen.getByText('Отправить повторно через 60 с.')).toBeInTheDocument();
    });

    it('should redirect to register page when location state is missing', () => {
        renderEmailVerification(null);

        expect(screen.getByText('Страница регистрации')).toBeInTheDocument();
    });

    it('should allow only digits in code input', async () => {
        const user = userEvent.setup();

        renderEmailVerification();

        const input = screen.getByPlaceholderText('Код');

        await user.type(input, '12ab34cd56');

        expect(input).toHaveValue('123456');
    });

    it('should keep submit button disabled when code has less than 6 digits', async () => {
        const user = userEvent.setup();

        renderEmailVerification();

        const input = screen.getByPlaceholderText('Код');
        const submitButton = screen.getByRole('button', {name: 'Подтвердить код'});

        await user.type(input, '12345');

        expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when code has exactly 6 digits', async () => {
        const user = userEvent.setup();

        renderEmailVerification();

        const input = screen.getByPlaceholderText('Код');
        const submitButton = screen.getByRole('button', {name: 'Подтвердить код'});

        await user.type(input, '123456');

        expect(submitButton).not.toBeDisabled();
    });

    it('should verify email, sign up user and navigate to main page after successful verification', async () => {
        const user = userEvent.setup();

        verifyEmail.mockResolvedValueOnce({});
        signUp.mockResolvedValueOnce({});

        renderEmailVerification();

        await user.type(screen.getByPlaceholderText('Код'), '123456');
        await user.click(screen.getByRole('button', {name: 'Подтвердить код'}));

        await waitFor(() => {
            expect(verifyEmail).toHaveBeenCalledWith('test@example.com', '123456');
        });

        await waitFor(() => {
            expect(signUp).toHaveBeenCalledWith(
                'Вероника',
                'test@example.com',
                'StrongPassword123'
            );
        });

        expect(await screen.findByText('Главная страница')).toBeInTheDocument();
    });

    it('should show error when verification code is incorrect', async () => {
        const user = userEvent.setup();

        verifyEmail.mockRejectedValueOnce({
            response: {
                status: 400,
            },
        });

        renderEmailVerification();

        await user.type(screen.getByPlaceholderText('Код'), '111111');
        await user.click(screen.getByRole('button', {name: 'Подтвердить код'}));

        expect(await screen.findByText('Неверный код. Попробуйте ещё раз.')).toBeInTheDocument();
        expect(signUp).not.toHaveBeenCalled();
    });

    it('should show expired code error when server returns 410', async () => {
        const user = userEvent.setup();

        verifyEmail.mockRejectedValueOnce({
            response: {
                status: 410,
            },
        });

        renderEmailVerification();

        await user.type(screen.getByPlaceholderText('Код'), '111111');
        await user.click(screen.getByRole('button', {name: 'Подтвердить код'}));

        expect(await screen.findByText('Срок действия кода истёк. Запросите новый.')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Отправить повторно'})).toBeInTheDocument();
    });

    it('should block verification after three incorrect attempts', async () => {
        const user = userEvent.setup();

        verifyEmail
            .mockRejectedValueOnce({response: {status: 400}})
            .mockRejectedValueOnce({response: {status: 400}})
            .mockRejectedValueOnce({response: {status: 400}});

        renderEmailVerification();

        const input = screen.getByPlaceholderText('Код');
        const submitButton = screen.getByRole('button', {name: 'Подтвердить код'});

        await user.type(input, '111111');
        await user.click(submitButton);

        expect(await screen.findByText('Неверный код. Попробуйте ещё раз.')).toBeInTheDocument();

        await user.clear(input);
        await user.type(input, '222222');
        await user.click(submitButton);

        expect(await screen.findByText('Неверный код. Попробуйте ещё раз.')).toBeInTheDocument();

        await user.clear(input);
        await user.type(input, '333333');
        await user.click(submitButton);

        expect(await screen.findByText('Код введён неверно. Запросите новый код.')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Отправить повторно'})).toBeInTheDocument();
    });

    it('should show resend button after timer reaches zero', () => {
        vi.useFakeTimers();

        renderEmailVerification();

        expect(screen.getByText('Отправить повторно через 60 с.')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(60000);
        });

        expect(screen.getByRole('button', {name: 'Отправить повторно'})).toBeInTheDocument();
    });

    it('should resend verification code and restart timer', async () => {
        vi.useFakeTimers();

        sendVerificationCode.mockResolvedValueOnce({});

        renderEmailVerification();

        act(() => {
            vi.advanceTimersByTime(60000);
        });

        expect(screen.getByRole('button', {name: 'Отправить повторно'})).toBeInTheDocument();

        vi.useRealTimers();

        const user = userEvent.setup();

        await user.click(screen.getByRole('button', {name: 'Отправить повторно'}));

        expect(sendVerificationCode).toHaveBeenCalledWith('test@example.com');

        expect(await screen.findByText('Отправить повторно через 60 с.')).toBeInTheDocument();
    });

    it('should show error when resend code fails', async () => {
        vi.useFakeTimers();

        sendVerificationCode.mockRejectedValueOnce(new Error('Network error'));

        renderEmailVerification();

        act(() => {
            vi.advanceTimersByTime(60000);
        });

        expect(screen.getByRole('button', {name: 'Отправить повторно'})).toBeInTheDocument();

        vi.useRealTimers();

        const user = userEvent.setup();

        await user.click(screen.getByRole('button', {name: 'Отправить повторно'}));

        expect(sendVerificationCode).toHaveBeenCalledWith('test@example.com');

        expect(await screen.findByText('Не удалось отправить код повторно. Попробуйте позже')).toBeInTheDocument();
    });

    it('should show error when signUp returns 409', async () => {
        const user = userEvent.setup();

        verifyEmail.mockResolvedValueOnce({});
        signUp.mockRejectedValueOnce({
            response: {
                status: 409,
            },
        });

        renderEmailVerification();

        await user.type(screen.getByPlaceholderText('Код'), '123456');
        await user.click(screen.getByRole('button', {name: 'Подтвердить код'}));

        expect(await screen.findByText('Аккаунт с таким email уже существует. Попробуйте войти')).toBeInTheDocument();
    });

    it('should show registration error when signUp fails without 409 status', async () => {
        const user = userEvent.setup();

        verifyEmail.mockResolvedValueOnce({});
        signUp.mockRejectedValueOnce(new Error('Network error'));

        renderEmailVerification();

        await user.type(screen.getByPlaceholderText('Код'), '123456');
        await user.click(screen.getByRole('button', {name: 'Подтвердить код'}));

        expect(await screen.findByText('Ошибка при регистрации. Попробуйте снова')).toBeInTheDocument();
    });

    it('should navigate back to register page when back button is clicked', async () => {
        const user = userEvent.setup();

        renderEmailVerification();

        await user.click(screen.getByRole('button', {name: 'Назад'}));

        expect(screen.getByText('Страница регистрации')).toBeInTheDocument();
    });
});
