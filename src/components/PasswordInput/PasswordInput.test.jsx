import React from 'react';
import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordInput from './PasswordInput.jsx';

describe('PasswordInput', () => {
    it('should render password input with placeholder', () => {
        render(
            <PasswordInput
                id="password"
                value=""
                onChange={() => {
                }}
                placeholder="Пароль"
                showPassword={false}
                onToggleVisibility={() => {
                }}
            />
        );

        expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    });

    it('should use password type when showPassword is false', () => {
        render(
            <PasswordInput
                id="password"
                value="123456"
                onChange={() => {
                }}
                placeholder="Пароль"
                showPassword={false}
                onToggleVisibility={() => {
                }}
            />
        );

        expect(screen.getByPlaceholderText('Пароль')).toHaveAttribute('type', 'password');
    });

    it('should use text type when showPassword is true', () => {
        render(
            <PasswordInput
                id="password"
                value="123456"
                onChange={() => {
                }}
                placeholder="Пароль"
                showPassword={true}
                onToggleVisibility={() => {
                }}
            />
        );

        expect(screen.getByPlaceholderText('Пароль')).toHaveAttribute('type', 'text');
    });

    it('should not render visibility toggle button when value is empty', () => {
        render(
            <PasswordInput
                id="password"
                value=""
                onChange={() => {
                }}
                placeholder="Пароль"
                showPassword={false}
                onToggleVisibility={() => {
                }}
            />
        );

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render visibility toggle button when value is not empty', () => {
        render(
            <PasswordInput
                id="password"
                value="123456"
                onChange={() => {
                }}
                placeholder="Пароль"
                showPassword={false}
                onToggleVisibility={() => {
                }}
            />
        );

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should call onToggleVisibility when visibility button is clicked', async () => {
        const user = userEvent.setup();
        const handleToggleVisibility = vi.fn();

        render(
            <PasswordInput
                id="password"
                value="123456"
                onChange={() => {
                }}
                placeholder="Пароль"
                showPassword={false}
                onToggleVisibility={handleToggleVisibility}
            />
        );

        await user.click(screen.getByRole('button'));

        expect(handleToggleVisibility).toHaveBeenCalledTimes(1);
    });

    it('should show error message when error prop is provided', () => {
        render(
            <PasswordInput
                id="password"
                value=""
                onChange={() => {
                }}
                placeholder="Пароль"
                showPassword={false}
                onToggleVisibility={() => {
                }}
                error="Введите пароль"
                hasError={true}
            />
        );

        expect(screen.getByText('Введите пароль')).toBeInTheDocument();
    });

    it('should apply inputError class when hasError is true', () => {
        render(
            <PasswordInput
                id="password"
                value=""
                onChange={() => {
                }}
                placeholder="Пароль"
                showPassword={false}
                onToggleVisibility={() => {
                }}
                hasError={true}
            />
        );
        const input = screen.getByPlaceholderText('Пароль');
        expect(input.className).toContain('inputError');
    });

    it('should call onChange when user types into input', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();

        render(
            <PasswordInput
                id="password"
                value=""
                onChange={handleChange}
                placeholder="Пароль"
                showPassword={false}
                onToggleVisibility={() => {
                }}
            />
        );

        await user.type(screen.getByPlaceholderText('Пароль'), 'secret');

        expect(handleChange).toHaveBeenCalledTimes(6);
    });

    it('should call onBlur when input loses focus', async () => {
        const user = userEvent.setup();
        const handleBlur = vi.fn();

        render(
            <PasswordInput
                id="password"
                value=""
                onChange={() => {
                }}
                onBlur={handleBlur}
                placeholder="Пароль"
                showPassword={false}
                onToggleVisibility={() => {
                }}
            />
        );

        const input = screen.getByPlaceholderText('Пароль');

        await user.click(input);
        await user.tab();

        expect(handleBlur).toHaveBeenCalledTimes(1);
    });
});
