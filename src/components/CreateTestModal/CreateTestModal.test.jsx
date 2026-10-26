import React from 'react';
import {describe, it, expect, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateTestModal from './CreateTestModal.jsx';

const renderModal = (props = {}) => {
    const defaultProps = {
        onClose: vi.fn(),
        onCreateManual: vi.fn().mockResolvedValue({success: true}),
        onCreateFromFile: vi.fn().mockResolvedValue({success: true}),
        showToast: vi.fn(),
    };

    const result = render(
        <CreateTestModal
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

describe('CreateTestModal', () => {
    it('should render modal title and form fields', () => {
        renderModal();

        expect(screen.getByText('Создание теста')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Введите название теста')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Введите краткое описание')).toBeInTheDocument();
        expect(screen.getByText('Добавление вопросов')).toBeInTheDocument();
    });

    it('should render file tab by default', () => {
        renderModal();

        expect(screen.getByRole('button', {name: 'Из файла'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Вручную'})).toBeInTheDocument();
        expect(screen.getByText('Перетащите файл сюда или нажмите, чтобы загрузить')).toBeInTheDocument();
    });

    it('should show validation errors and toast when trying to create from file with empty form', async () => {
        const user = userEvent.setup();
        const {props} = renderModal();

        await user.click(screen.getByRole('button', {name: 'Создать тест'}));

        expect(screen.getByText('Обязательное поле')).toBeInTheDocument();
        expect(screen.getByText('Прикрепите файл для создания теста')).toBeInTheDocument();

        expect(props.showToast).toHaveBeenCalledWith(
            'error',
            'Проверьте правильность заполнения формы'
        );

        expect(props.onCreateFromFile).not.toHaveBeenCalled();
        expect(props.onCreateManual).not.toHaveBeenCalled();
    });

    it('should switch to manual tab', async () => {
        const user = userEvent.setup();

        renderModal();

        await user.click(screen.getByRole('button', {name: 'Вручную'}));

        expect(screen.getByText('Вопросы будут добавлены позже')).toBeInTheDocument();
        expect(screen.getByText('После создания теста вы перейдете на страницу редактирования, где сможете добавить вопросы вручную')).toBeInTheDocument();
    });

    it('should create test manually and close modal on success', async () => {
        const user = userEvent.setup();
        const {props} = renderModal();

        await user.click(screen.getByRole('button', {name: 'Вручную'}));

        await user.type(
            screen.getByPlaceholderText('Введите название теста'),
            'React test'
        );

        await user.type(
            screen.getByPlaceholderText('Введите краткое описание'),
            'Описание теста'
        );

        await user.click(screen.getByRole('button', {name: 'Создать тест'}));

        await waitFor(() => {
            expect(props.onCreateManual).toHaveBeenCalledWith({
                name: 'React test',
                description: 'Описание теста',
            });
        });

        expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('should show toast when manual creation fails', async () => {
        const user = userEvent.setup();

        const onCreateManual = vi.fn().mockResolvedValue({
            success: false,
            message: 'Не удалось создать тест вручную',
        });

        const {props} = renderModal({onCreateManual});

        await user.click(screen.getByRole('button', {name: 'Вручную'}));
        await user.type(screen.getByPlaceholderText('Введите название теста'), 'React test');
        await user.click(screen.getByRole('button', {name: 'Создать тест'}));

        await waitFor(() => {
            expect(props.showToast).toHaveBeenCalledWith(
                'error',
                'Не удалось создать тест вручную'
            );
        });

        expect(props.onClose).not.toHaveBeenCalled();
    });

    it('should create test from file and close modal on success', async () => {
        const user = userEvent.setup();
        const {props} = renderModal();

        const file = new File(['content'], 'questions.txt', {
            type: 'text/plain',
        });

        await user.type(
            screen.getByPlaceholderText('Введите название теста'),
            'File test'
        );

        await user.type(
            screen.getByPlaceholderText('Введите краткое описание'),
            'Описание'
        );

        const fileInput = document.querySelector('input[type="file"]');

        await user.upload(fileInput, file);

        await user.click(screen.getByRole('button', {name: 'Создать тест'}));

        await waitFor(() => {
            expect(props.onCreateFromFile).toHaveBeenCalledWith({
                name: 'File test',
                description: 'Описание',
                file,
            });
        });

        expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay is clicked', async () => {
        const user = userEvent.setup();
        const {container, props} = renderModal();

        await user.click(container.firstChild);

        expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when modal content is clicked', async () => {
        const user = userEvent.setup();
        const {props} = renderModal();

        await user.click(screen.getByText('Создание теста'));

        expect(props.onClose).not.toHaveBeenCalled();
    });
});
