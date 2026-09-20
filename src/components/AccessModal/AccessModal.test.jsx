import React from 'react';
import {describe, it, expect, vi, afterEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccessModal from './AccessModal.jsx';
import {ACCESS_MODES} from '../../constants/accessConstants.js';

const renderModal = (props = {}) => {
    const defaultProps = {
        initialMode: ACCESS_MODES.PRIVATE,
        shareLink: 'https://example.com/share/token',
        onClose: vi.fn(),
        onSave: vi.fn().mockResolvedValue(undefined),
    };

    const result = render(
        <AccessModal
            {...defaultProps}
            {...props}
        />
    );

    return {
        ...result,
        props: {
            ...defaultProps,
            ...props,
        },
    };
};

describe('AccessModal', () => {
    afterEach(() => {
        document.body.style.overflow = '';
        vi.restoreAllMocks();
    });

    it('should render modal title and access options', () => {
        renderModal();

        expect(screen.getByText('Настройки доступа к тесту')).toBeInTheDocument();
        expect(screen.getByText('Приватный')).toBeInTheDocument();
        expect(screen.getByText('Публичный')).toBeInTheDocument();
        expect(screen.getByText('Доступ по ссылке')).toBeInTheDocument();
    });

    it('should select initial access mode', () => {
        renderModal({
            initialMode: ACCESS_MODES.PUBLIC,
        });

        expect(screen.getByDisplayValue(ACCESS_MODES.PUBLIC)).toBeChecked();
    });

    it('should change selected access mode when user clicks option', async () => {
        const user = userEvent.setup();
        renderModal();

        await user.click(screen.getByText('Публичный'));

        expect(screen.getByDisplayValue(ACCESS_MODES.PUBLIC)).toBeChecked();
    });

    it('should show share link input when link access mode is selected', async () => {
        const user = userEvent.setup();
        renderModal();

        await user.click(screen.getByText('Доступ по ссылке'));

        expect(screen.getByDisplayValue('https://example.com/share/token')).toBeInTheDocument();
    });

    it('should call onSave with selected mode and close modal', async () => {
        const user = userEvent.setup();
        const {props} = renderModal();

        await user.click(screen.getByText('Публичный'));
        await user.click(screen.getByRole('button', {name: 'Сохранить'}));

        await waitFor(() => {
            expect(props.onSave).toHaveBeenCalledWith(ACCESS_MODES.PUBLIC);
        });

        expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('should not close modal when saving fails', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn().mockRejectedValue(new Error('Save error'));
        const {props} = renderModal({onSave});

        await user.click(screen.getByRole('button', {name: 'Сохранить'}));

        await waitFor(() => {
            expect(props.onSave).toHaveBeenCalled();
        });

        expect(props.onClose).not.toHaveBeenCalled();
    });

    it('should copy share link to clipboard', async () => {
        const user = userEvent.setup();
        const writeText = vi.fn().mockResolvedValue(undefined);

        Object.defineProperty(navigator, 'clipboard', {
            value: {writeText},
            configurable: true,
        });

        Object.defineProperty(window, 'isSecureContext', {
            value: true,
            configurable: true,
        });

        renderModal({
            initialMode: ACCESS_MODES.LINK,
        });

        const copyButton = screen.getByRole('button', {name: /скопировать ссылку/i});
        await user.click(copyButton);

        expect(writeText).toHaveBeenCalledWith('https://example.com/share/token');
    });

    it('should call onClose when overlay is clicked', async () => {
        const user = userEvent.setup();
        const {container, props} = renderModal();

        await user.click(container.firstChild);

        expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('should set body overflow to hidden while modal is mounted and reset on unmount', () => {
        const {unmount} = renderModal();

        expect(document.body.style.overflow).toBe('hidden');

        unmount();

        expect(document.body.style.overflow).toBe('');
    });
});
