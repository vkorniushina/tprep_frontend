import React from 'react';
import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResultModal from './ResultModal.jsx';

const resultWithErrors = {
    progress: 3,
    questionsCount: 5,
};

const perfectResult = {
    progress: 5,
    questionsCount: 5,
};

const renderModal = (result = resultWithErrors, extraProps = {}) => {
    const props = {
        result,
        onRetry: vi.fn(),
        onFixErrors: vi.fn(),
        onClose: vi.fn(),
        ...extraProps,
    };

    const view = render(
        <ResultModal {...props} />
    );

    return {...view, props};
};

describe('ResultModal', () => {
    it('should render nothing when result is null', () => {
        const {container} = renderModal(null);

        expect(container).toBeEmptyDOMElement();
    });

    it('should render result information', () => {
        renderModal();

        expect(screen.getByText('Результаты теста')).toBeInTheDocument();
        expect(screen.getByText('Ваши ответы:')).toBeInTheDocument();
        expect(screen.getByText('3/5')).toBeInTheDocument();
        expect(screen.getByText('Процент успешности:')).toBeInTheDocument();
        expect(screen.getByText('60%')).toBeInTheDocument();
    });

    it('should render fix errors button when result has errors', () => {
        renderModal();

        expect(screen.getByRole('button', {name: /исправить ошибки/i})).toBeInTheDocument();
    });

    it('should not render fix errors button when all answers are correct', () => {
        renderModal(perfectResult);

        expect(screen.queryByRole('button', {name: /исправить ошибки/i})).not.toBeInTheDocument();
    });

    it('should render reminders button when onOpenReminders is provided', () => {
        renderModal(resultWithErrors, {onOpenReminders: vi.fn()});

        expect(screen.getByRole('button', {name: /настроить напоминания/i})).toBeInTheDocument();
    });

    it('should not render reminders button when onOpenReminders is not provided', () => {
        renderModal();

        expect(screen.queryByRole('button', {name: /настроить напоминания/i})).not.toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', async () => {
        const user = userEvent.setup();
        const {props} = renderModal();

        await user.click(screen.getByRole('button', {name: /пройти тест заново/i}));

        expect(props.onRetry).toHaveBeenCalledTimes(1);
    });

    it('should call onFixErrors when fix errors button is clicked', async () => {
        const user = userEvent.setup();
        const {props} = renderModal();

        await user.click(screen.getByRole('button', {name: /исправить ошибки/i}));

        expect(props.onFixErrors).toHaveBeenCalledTimes(1);
    });

    it('should call onOpenReminders when reminders button is clicked', async () => {
        const user = userEvent.setup();
        const handleOpenReminders = vi.fn();
        renderModal(resultWithErrors, {onOpenReminders: handleOpenReminders});

        await user.click(screen.getByRole('button', {name: /настроить напоминания/i}));

        expect(handleOpenReminders).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        const {props} = renderModal();

        await user.click(screen.getByRole('button', {name: /закрыть/i}));

        expect(props.onClose).toHaveBeenCalledTimes(1);
    });
});
