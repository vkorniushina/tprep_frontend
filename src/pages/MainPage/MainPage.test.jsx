import React from 'react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import MainPage from './MainPage.jsx';
import {
    createModuleManual,
    deleteModule,
    getAllModules,
    getPublicModules,
    searchModules,
} from '../../api/modules.js';

vi.mock('../../api/modules.js', () => ({
    getAllModules: vi.fn(),
    getPublicModules: vi.fn(),
    searchModules: vi.fn(),
    deleteModule: vi.fn(),
    createModuleManual: vi.fn(),
    createModuleByFile: vi.fn(),
}));

const makeTest = (overrides = {}) => ({
    id: 1,
    name: 'React test',
    description: 'Описание React test',
    questionsCount: 10,
    progress: 3,
    ...overrides,
});

const page = (items, totalPages = 1) => ({items, totalPages});

const renderMainPage = () => render(
    <MemoryRouter initialEntries={['/']}>
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/test/:id" element={<div>Страница теста</div>}/>
            <Route path="/test/:id/edit" element={<div>Страница редактирования</div>}/>
            <Route path="/profile" element={<div>Страница профиля</div>}/>
        </Routes>
    </MemoryRouter>
);

describe('MainPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('loading tests', () => {
        it('shows loading state while request is pending', () => {
            getAllModules.mockReturnValueOnce(new Promise(() => {
            }));

            renderMainPage();

            expect(screen.getByText('Загрузка тестов...')).toBeInTheDocument();
        });

        it('renders cards with data from API', async () => {
            getAllModules.mockResolvedValueOnce(page([makeTest()]));

            renderMainPage();

            expect(await screen.findByText('React test')).toBeInTheDocument();
            expect(screen.getByText('Описание React test')).toBeInTheDocument();
            expect(screen.getByText('10 вопросов')).toBeInTheDocument();
            expect(screen.getByText('30%')).toBeInTheDocument();
            expect(getAllModules).toHaveBeenCalledWith({page: 0, size: 6});
        });

        it('shows empty state when user has no tests', async () => {
            getAllModules.mockResolvedValueOnce(page([], 0));

            renderMainPage();

            expect(await screen.findByText('У вас пока нет тестов')).toBeInTheDocument();
            expect(screen.getByText('Создайте первый тест, чтобы начать обучение')).toBeInTheDocument();
        });

        it('shows error when request fails', async () => {
            getAllModules.mockRejectedValueOnce(new Error('Network'));

            renderMainPage();

            expect(await screen.findByText('Не удалось загрузить тесты')).toBeInTheDocument();
        });
    });

    describe('search', () => {
        it('searches my tests through the real header input', async () => {
            const user = userEvent.setup();
            getAllModules.mockResolvedValueOnce(page([], 0));
            searchModules.mockResolvedValue(page([makeTest({id: 5, name: 'Found test'})]));

            renderMainPage();
            await screen.findByText('У вас пока нет тестов');

            await user.type(screen.getByPlaceholderText('Поиск тестов...'), 'react');

            expect(await screen.findByText('Found test')).toBeInTheDocument();
            expect(searchModules).toHaveBeenLastCalledWith({keyword: 'react', page: 0, size: 6});
        });

        it('shows "nothing found" message when search has no results', async () => {
            const user = userEvent.setup();
            getAllModules.mockResolvedValueOnce(page([], 0));
            searchModules.mockResolvedValue(page([], 0));

            renderMainPage();
            await screen.findByText('У вас пока нет тестов');

            await user.type(screen.getByPlaceholderText('Поиск тестов...'), 'xyz');

            expect(await screen.findByText('По вашему запросу ничего не найдено')).toBeInTheDocument();
            expect(screen.getByText('Попробуйте изменить поисковый запрос')).toBeInTheDocument();
        });
    });

    describe('tabs', () => {
        it('loads public tests and hides create button on "Все тесты" tab', async () => {
            const user = userEvent.setup();
            getAllModules.mockResolvedValueOnce(page([], 0));
            getPublicModules.mockResolvedValueOnce(page([makeTest({id: 2, name: 'Public test'})]));

            renderMainPage();
            await screen.findByText('У вас пока нет тестов');

            await user.click(screen.getByRole('button', {name: 'Все тесты'}));

            expect(await screen.findByText('Public test')).toBeInTheDocument();
            expect(getPublicModules).toHaveBeenCalledWith({page: 0, size: 6, keyword: undefined});
            expect(screen.queryByRole('button', {name: /создать тест/i})).not.toBeInTheDocument();
            expect(screen.queryByRole('button', {name: 'Menu'})).not.toBeInTheDocument();
        });

        it('shows public empty state', async () => {
            const user = userEvent.setup();
            getAllModules.mockResolvedValueOnce(page([], 0));
            getPublicModules.mockResolvedValueOnce(page([], 0));

            renderMainPage();
            await screen.findByText('У вас пока нет тестов');
            await user.click(screen.getByRole('button', {name: 'Все тесты'}));

            expect(await screen.findByText('Публичных тестов пока нет')).toBeInTheDocument();
        });
    });

    describe('pagination', () => {
        it('requests next page when user clicks page number', async () => {
            const user = userEvent.setup();
            getAllModules
                .mockResolvedValueOnce(page([makeTest()], 3))
                .mockResolvedValueOnce(page([makeTest({id: 7, name: 'Second page test'})], 3));

            renderMainPage();
            await screen.findByText('React test');

            await user.click(screen.getByRole('button', {name: '2'}));

            expect(await screen.findByText('Second page test')).toBeInTheDocument();
            expect(getAllModules).toHaveBeenLastCalledWith({page: 1, size: 6});
        });
    });

    describe('cards', () => {
        it('opens test page when user clicks "Открыть тест"', async () => {
            const user = userEvent.setup();
            getAllModules.mockResolvedValueOnce(page([makeTest()]));

            renderMainPage();
            await screen.findByText('React test');

            await user.click(screen.getByRole('button', {name: 'Открыть тест'}));

            expect(screen.getByText('Страница теста')).toBeInTheDocument();
        });

        it('deletes test through card menu, reloads list and shows toast', async () => {
            const user = userEvent.setup();
            getAllModules
                .mockResolvedValueOnce(page([makeTest()]))
                .mockResolvedValueOnce(page([], 0));
            deleteModule.mockResolvedValueOnce({});

            renderMainPage();
            await screen.findByText('React test');

            await user.click(screen.getByRole('button', {name: 'Menu'}));
            await user.click(screen.getByRole('button', {name: 'Удалить'}));

            await waitFor(() => expect(deleteModule).toHaveBeenCalledWith(1));
            expect(await screen.findByText('Тест удалён!')).toBeInTheDocument();
            expect(await screen.findByText('У вас пока нет тестов')).toBeInTheDocument();
        });

        it('shows error toast when delete fails', async () => {
            const user = userEvent.setup();
            getAllModules.mockResolvedValueOnce(page([makeTest()]));
            deleteModule.mockRejectedValueOnce(new Error('fail'));

            renderMainPage();
            await screen.findByText('React test');

            await user.click(screen.getByRole('button', {name: 'Menu'}));
            await user.click(screen.getByRole('button', {name: 'Удалить'}));

            expect(await screen.findByText('Не удалось удалить тест')).toBeInTheDocument();
            expect(screen.getByText('React test')).toBeInTheDocument();
        });
    });

    describe('creating test', () => {
        it('creates test manually through the real modal and opens editor', async () => {
            const user = userEvent.setup();
            getAllModules.mockResolvedValueOnce(page([], 0));
            createModuleManual.mockResolvedValueOnce({id: 10});

            renderMainPage();
            await screen.findByText('У вас пока нет тестов');

            await user.click(screen.getByRole('button', {name: /создать тест/i}));
            expect(screen.getByText('Создание теста')).toBeInTheDocument();

            await user.click(screen.getByRole('button', {name: 'Вручную'}));
            await user.type(screen.getByPlaceholderText('Введите название теста'), 'Новый тест');
            await user.click(screen.getByRole('button', {name: 'Создать тест'}));

            await waitFor(() => {
                expect(createModuleManual).toHaveBeenCalledWith({name: 'Новый тест', description: ''});
            });
            expect(await screen.findByText('Страница редактирования')).toBeInTheDocument();
        });

        it('shows error toast when manual creation fails', async () => {
            const user = userEvent.setup();
            getAllModules.mockResolvedValueOnce(page([], 0));
            createModuleManual.mockRejectedValueOnce(new Error('fail'));

            renderMainPage();
            await screen.findByText('У вас пока нет тестов');

            await user.click(screen.getByRole('button', {name: /создать тест/i}));
            await user.click(screen.getByRole('button', {name: 'Вручную'}));
            await user.type(screen.getByPlaceholderText('Введите название теста'), 'Новый тест');
            await user.click(screen.getByRole('button', {name: 'Создать тест'}));

            expect(await screen.findByText('Не удалось создать тест вручную')).toBeInTheDocument();
            expect(screen.getByText('Создание теста')).toBeInTheDocument();
        });

        it('blocks body scroll while modal is open', async () => {
            const user = userEvent.setup();
            getAllModules.mockResolvedValueOnce(page([], 0));

            renderMainPage();
            await screen.findByText('У вас пока нет тестов');
            await user.click(screen.getByRole('button', {name: /создать тест/i}));

            expect(document.body.style.overflow).toBe('hidden');
        });
    });
});
