import React from 'react';
import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from './FormInput.jsx';

const TestIcon = ({className}) => (
    <svg className={className} data-testid="test-icon"/>
);

describe('FormInput', () => {
    it('should render input with placeholder', () => {
        render(
            <FormInput
                type="email"
                id="email"
                value=""
                onChange={() => {
                }}
                placeholder="E-mail"
            />
        );

        expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    });

    it('should render input with provided type and value', () => {
        render(
            <FormInput
                type="email"
                id="email"
                value="test@example.com"
                onChange={() => {
                }}
                placeholder="E-mail"
            />
        );

        const input = screen.getByPlaceholderText('E-mail');

        expect(input).toHaveAttribute('type', 'email');
        expect(input).toHaveValue('test@example.com');
    });

    it('should show error message when error prop is provided', () => {
        render(
            <FormInput
                type="email"
                id="email"
                value=""
                onChange={() => {
                }}
                placeholder="E-mail"
                error="Некорректный email"
            />
        );

        expect(screen.getByText('Некорректный email')).toBeInTheDocument();
    });

    it('should not show error message when error prop is not provided', () => {
        render(
            <FormInput
                type="email"
                id="email"
                value=""
                onChange={() => {
                }}
                placeholder="E-mail"
            />
        );

        expect(screen.queryByText('Некорректный email')).not.toBeInTheDocument();
    });

    it('should apply error class to input when error prop is provided', () => {
        render(
            <FormInput
                type="text"
                id="name"
                value=""
                onChange={() => {
                }}
                placeholder="Имя"
                error="Ошибка"
            />
        );

        const input = screen.getByPlaceholderText('Имя');
        expect(input.className).toContain('inputError');
    });

    it('should call onChange when user types into input', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();

        render(
            <FormInput
                type="email"
                id="email"
                value=""
                onChange={handleChange}
                placeholder="E-mail"
            />
        );

        await user.type(screen.getByPlaceholderText('E-mail'), 'test');

        expect(handleChange).toHaveBeenCalledTimes(4);
    });

    it('should call onBlur when input loses focus', async () => {
        const user = userEvent.setup();
        const handleBlur = vi.fn();

        render(
            <FormInput
                type="text"
                id="name"
                value=""
                onChange={() => {
                }}
                onBlur={handleBlur}
                placeholder="Имя"
            />
        );

        const input = screen.getByPlaceholderText('Имя');

        await user.click(input);
        await user.tab();

        expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should render icon when icon prop is provided', () => {
        render(
            <FormInput
                type="text"
                id="name"
                value=""
                onChange={() => {
                }}
                placeholder="Имя"
                icon={TestIcon}
            />
        );

        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
});
