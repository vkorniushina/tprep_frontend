import React from 'react';
import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExitConfirmModal from './ExitConfirmModal.jsx';

describe('ExitConfirmModal', () => {
    it('should render nothing when open is false', () => {
        const {container} = render(
            <ExitConfirmModal
                open={false}
                onCancel={() => {
                }}
                onConfirm={() => {
                }}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('should render modal content when open is true', () => {
        render(
            <ExitConfirmModal
                open={true}
                onCancel={() => {
                }}
                onConfirm={() => {
                }}
            />
        );

        expect(screen.getByText('Вы точно хотите выйти?')).toBeInTheDocument();
        expect(screen.getByText('Прогресс будет утерян')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Остаться'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Выйти'})).toBeInTheDocument();
    });

    it('should call onCancel when stay button is clicked', async () => {
        const user = userEvent.setup();
        const handleCancel = vi.fn();

        render(
            <ExitConfirmModal
                open={true}
                onCancel={handleCancel}
                onConfirm={() => {
                }}
            />
        );

        await user.click(screen.getByRole('button', {name: 'Остаться'}));

        expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm when exit button is clicked', async () => {
        const user = userEvent.setup();
        const handleConfirm = vi.fn();

        render(
            <ExitConfirmModal
                open={true}
                onCancel={() => {
                }}
                onConfirm={handleConfirm}
            />
        );

        await user.click(screen.getByRole('button', {name: 'Выйти'}));

        expect(handleConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when close button is clicked', async () => {
        const user = userEvent.setup();
        const handleCancel = vi.fn();

        render(
            <ExitConfirmModal
                open={true}
                onCancel={handleCancel}
                onConfirm={() => {
                }}
            />
        );

        const closeButton = screen.getByRole('button', {name: /закрыть/i});

        await user.click(closeButton);

        expect(handleCancel).toHaveBeenCalledTimes(1);
    });
});
