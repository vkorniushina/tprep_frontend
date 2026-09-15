import React from 'react';
import {describe, it, expect, vi, afterEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import ToastNotification from './ToastNotification.jsx';
import styles from './ToastNotification.module.scss';

describe('ToastNotification', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('should render provided message', () => {
        render(
            <ToastNotification
                type="success"
                message="Тест создан"
                onClose={() => {
                }}
            />
        );

        expect(screen.getByText('Тест создан')).toBeInTheDocument();
    });

    it('should apply success class by default', () => {
        const {container} = render(
            <ToastNotification
                message="Успешно"
                onClose={() => {
                }}
            />
        );

        expect(container.firstChild).toHaveClass(styles.success);
    });

    it('should apply error class when type is error', () => {
        const {container} = render(
            <ToastNotification
                type="error"
                message="Ошибка"
                onClose={() => {
                }}
            />
        );

        expect(container.firstChild).toHaveClass(styles.error);
    });

    it('should call onClose after 3000 milliseconds', () => {
        vi.useFakeTimers();

        const handleClose = vi.fn();

        render(
            <ToastNotification
                type="success"
                message="Сохранено"
                onClose={handleClose}
            />
        );

        expect(handleClose).not.toHaveBeenCalled();

        vi.advanceTimersByTime(3000);

        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should clear timer on unmount', () => {
        vi.useFakeTimers();

        const handleClose = vi.fn();

        const {unmount} = render(
            <ToastNotification
                type="success"
                message="Сохранено"
                onClose={handleClose}
            />
        );

        unmount();

        vi.advanceTimersByTime(3000);

        expect(handleClose).not.toHaveBeenCalled();
    });
});
