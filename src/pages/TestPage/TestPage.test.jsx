import React from 'react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes, useLocation} from 'react-router-dom';
import TestPage from './TestPage.jsx';
import {
    getModuleById,
    getModuleByToken,
    getModuleQuestions,
    getModuleQuestionsByToken,
    updateModuleAccess,
} from '../../api/modules.js';
import {ACCESS_MODES} from '../../constants/accessConstants.js';
import {PROFILE_TABS} from '../../constants/profileConstants.js';
import {QUESTION_TYPES} from '../../constants/questionTypes.js';

vi.mock('../../api/modules.js', () => ({
    getModuleById: vi.fn(),
    getModuleByToken: vi.fn(),
    getModuleQuestions: vi.fn(),
    getModuleQuestionsByToken: vi.fn(),
    updateModuleAccess: vi.fn(),
}));

const makeModule = (overrides = {}) => ({
    id: 1,
    name: 'React test',
    description: 'Описание',
    lastUse: '31/05/2026',
    progress: 2,
    questionsCount: 3,
    accessMode: ACCESS_MODES.PRIVATE,
    shareToken: 'share-token',
    owner: true,
    ...overrides,
});

const questionsResponse = {
    questions: [
        {
            id: 1,
            type: QUESTION_TYPES.INPUT,
            content: 'Первый вопрос',
            answers: [{id: 11, content: 'Правильный ответ', isCorrect: true}],
        },
        {
            id: 2,
            type: QUESTION_TYPES.CHOICE,
            content: 'Второй вопрос',
            answers: [
                {id: 21, content: 'Вариант 1', isCorrect: true},
                {id: 22, content: 'Вариант 2', isCorrect: false},
            ],
        },
    ],
};

const deferred = () => {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return {promise, resolve, reject};
};

const silenceConsoleError = () => vi.spyOn(console, 'error').mockImplementation(() => {});

const ProfileStub = () => {
    const location = useLocation();
    return <div>Профиль, вкладка: {location.state?.tab}</div>;
};

const renderTestPage = (path = '/test/1') => render(
    <MemoryRouter initialEntries={[path]}>
        <Routes>
            <Route path="/test/:id" element={<TestPage/>}/>
            <Route path="/share/:shareToken" element={<TestPage/>}/>
            <Route path="/test/:id/quiz" element={<div>Прохождение теста</div>}/>
            <Route path="/share/:shareToken/quiz" element={<div>Прохождение теста по ссылке</div>}/>
            <Route path="/test/:id/edit" element={<div>Редактирование</div>}/>
            <Route path="/profile" element={<ProfileStub/>}/>
        </Routes>
    </MemoryRouter>
);

describe('TestPage', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('loading test info', () => {
        it('shows loading state', () => {
            getModuleById.mockReturnValueOnce(new Promise(() => {
            }));

            renderTestPage();

            expect(screen.getByText('Загрузка...')).toBeInTheDocument();
        });

        it('renders test info', async () => {
            getModuleById.mockResolvedValueOnce(makeModule());

            renderTestPage();

            expect(await screen.findByRole('heading', {name: 'React test'})).toBeInTheDocument();
            expect(screen.getByText('Описание теста')).toBeInTheDocument();
            expect(screen.getByText(/Последнее прохождение: 31 мая 2026/)).toBeInTheDocument();
            expect(screen.getByText('2 / 3')).toBeInTheDocument();
            expect(getModuleById).toHaveBeenCalledWith(1);
        });

        it('shows placeholder when description is empty', async () => {
            getModuleById.mockResolvedValueOnce(makeModule({description: ''}));

            renderTestPage();

            expect(await screen.findByText('Здесь могло быть описание...')).toBeInTheDocument();
        });

        it('shows error state when loading fails', async () => {
            silenceConsoleError();
            getModuleById.mockRejectedValueOnce(new Error('fail'));

            renderTestPage();

            expect(await screen.findByText('Не удалось загрузить информацию о тесте')).toBeInTheDocument();
        });
    });

    describe('header actions', () => {
        it('starts quiz and removes quiz lock', async () => {
            const user = userEvent.setup();
            sessionStorage.setItem('quiz_locked_1', 'true');
            getModuleById.mockResolvedValueOnce(makeModule());

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});

            await user.click(screen.getByRole('button', {name: /начать тест/i}));

            expect(screen.getByText('Прохождение теста')).toBeInTheDocument();
            expect(sessionStorage.getItem('quiz_locked_1')).toBeNull();
        });

        it('disables start button when test has no questions', async () => {
            getModuleById.mockResolvedValueOnce(makeModule({questionsCount: 0, progress: 0}));

            renderTestPage();

            expect(await screen.findByRole('button', {name: /начать тест/i})).toBeDisabled();
        });

        it('owner can open editor', async () => {
            const user = userEvent.setup();
            getModuleById.mockResolvedValueOnce(makeModule());

            renderTestPage();
            await user.click(await screen.findByRole('button', {name: /редактировать/i}));

            expect(screen.getByText('Редактирование')).toBeInTheDocument();
        });

        it('non-owner does not see edit button and menu', async () => {
            getModuleById.mockResolvedValueOnce(makeModule({owner: false}));

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});

            expect(screen.queryByRole('button', {name: /редактировать/i})).not.toBeInTheDocument();
            expect(screen.queryByRole('button', {name: 'Меню'})).not.toBeInTheDocument();
        });
    });

    describe('questions', () => {
        it('loads questions with answers on first click and hides them on second', async () => {
            const user = userEvent.setup();
            getModuleById.mockResolvedValueOnce(makeModule());
            getModuleQuestions.mockResolvedValueOnce(questionsResponse);

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});

            await user.click(screen.getByRole('button', {name: 'Показать вопросы'}));

            expect(await screen.findByText('Первый вопрос')).toBeInTheDocument();
            expect(screen.getByText('Правильный ответ')).toBeInTheDocument();
            expect(screen.getByText('Второй вопрос')).toBeInTheDocument();
            expect(screen.getByText('Вариант 1')).toBeInTheDocument();
            expect(getModuleQuestions).toHaveBeenCalledWith(1);

            await user.click(screen.getByRole('button', {name: 'Скрыть вопросы'}));
            expect(screen.queryByText('Первый вопрос')).not.toBeInTheDocument();
        });

        it('shows loading state and disables the toggle button while questions are loading', async () => {
            const user = userEvent.setup();
            const {promise, resolve} = deferred();

            getModuleQuestions.mockReturnValueOnce(promise);
            getModuleById.mockResolvedValueOnce(makeModule());

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});

            await user.click(screen.getByRole('button', {name: 'Показать вопросы'}));

            expect(screen.getByText('Загрузка вопросов...')).toBeInTheDocument();
            expect(screen.getByRole('button', {name: 'Скрыть вопросы'})).toBeDisabled();

            resolve(questionsResponse);

            expect(await screen.findByText('Первый вопрос')).toBeInTheDocument();
            expect(screen.queryByText('Загрузка вопросов...')).not.toBeInTheDocument();
            expect(screen.getByRole('button', {name: 'Скрыть вопросы'})).toBeEnabled();
        });

        it('does not reload questions when shown again', async () => {
            const user = userEvent.setup();
            getModuleById.mockResolvedValueOnce(makeModule());
            getModuleQuestions.mockResolvedValueOnce(questionsResponse);

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});

            await user.click(screen.getByRole('button', {name: 'Показать вопросы'}));
            await screen.findByText('Первый вопрос');
            await user.click(screen.getByRole('button', {name: 'Скрыть вопросы'}));
            await user.click(screen.getByRole('button', {name: 'Показать вопросы'}));

            expect(screen.getByText('Первый вопрос')).toBeInTheDocument();
            expect(getModuleQuestions).toHaveBeenCalledTimes(1);
        });

        it('shows empty questions message', async () => {
            const user = userEvent.setup();
            getModuleById.mockResolvedValueOnce(makeModule());
            getModuleQuestions.mockResolvedValueOnce({questions: []});

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});
            await user.click(screen.getByRole('button', {name: 'Показать вопросы'}));

            expect(await screen.findByText('Вопросов пока нет')).toBeInTheDocument();
        });

        it('shows questions loading error', async () => {
            silenceConsoleError();
            const user = userEvent.setup();
            getModuleById.mockResolvedValueOnce(makeModule());
            getModuleQuestions.mockRejectedValueOnce(new Error('fail'));

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});
            await user.click(screen.getByRole('button', {name: 'Показать вопросы'}));

            expect(await screen.findByText('Не удалось загрузить вопросы теста')).toBeInTheDocument();
        });

        it('retries loading questions after an error and clears the error', async () => {
            silenceConsoleError();
            const user = userEvent.setup();
            getModuleById.mockResolvedValueOnce(makeModule());
            getModuleQuestions
                .mockRejectedValueOnce(new Error('fail'))
                .mockResolvedValueOnce(questionsResponse);

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});
            await user.click(screen.getByRole('button', {name: 'Показать вопросы'}));
            await screen.findByText('Не удалось загрузить вопросы теста');

            await user.click(screen.getByRole('button', {name: 'Скрыть вопросы'}));
            await user.click(screen.getByRole('button', {name: 'Показать вопросы'}));

            expect(await screen.findByText('Первый вопрос')).toBeInTheDocument();
            expect(screen.queryByText('Не удалось загрузить вопросы теста')).not.toBeInTheDocument();
            expect(getModuleQuestions).toHaveBeenCalledTimes(2);
        });
    });

    describe('owner menu', () => {
        it('navigates to reminders tab in profile', async () => {
            const user = userEvent.setup();
            getModuleById.mockResolvedValueOnce(makeModule());

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});

            await user.click(screen.getByRole('button', {name: 'Меню'}));
            await user.click(screen.getByRole('button', {name: 'Настроить напоминания'}));

            expect(screen.getByText(`Профиль, вкладка: ${PROFILE_TABS.REMINDERS}`)).toBeInTheDocument();
        });

        it('changes access mode through the real AccessModal', async () => {
            const user = userEvent.setup();
            getModuleById.mockResolvedValueOnce(makeModule());
            updateModuleAccess.mockResolvedValueOnce({
                accessMode: ACCESS_MODES.PUBLIC,
                shareToken: 'new-token',
            });

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});

            await user.click(screen.getByRole('button', {name: 'Меню'}));
            await user.click(screen.getByRole('button', {name: 'Настройки доступа'}));
            expect(screen.getByText('Настройки доступа к тесту')).toBeInTheDocument();

            await user.click(screen.getByText('Публичный'));
            await user.click(screen.getByRole('button', {name: 'Сохранить'}));

            await waitFor(() => {
                expect(updateModuleAccess).toHaveBeenCalledWith(1, ACCESS_MODES.PUBLIC);
            });
            await waitFor(() => {
                expect(screen.queryByText('Настройки доступа к тесту')).not.toBeInTheDocument();
            });
        });

        it('shows share link for link access mode', async () => {
            const user = userEvent.setup();
            getModuleById.mockResolvedValueOnce(makeModule({accessMode: ACCESS_MODES.LINK}));

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});

            await user.click(screen.getByRole('button', {name: 'Меню'}));
            await user.click(screen.getByRole('button', {name: 'Настройки доступа'}));

            expect(screen.getByDisplayValue(`${window.location.origin}/share/share-token`)).toBeInTheDocument();
        });

        it('keeps modal open when saving access fails', async () => {
            silenceConsoleError();
            const user = userEvent.setup();
            getModuleById.mockResolvedValueOnce(makeModule());
            updateModuleAccess.mockRejectedValueOnce(new Error('fail'));

            renderTestPage();
            await screen.findByRole('heading', {name: 'React test'});

            await user.click(screen.getByRole('button', {name: 'Меню'}));
            await user.click(screen.getByRole('button', {name: 'Настройки доступа'}));
            await user.click(screen.getByRole('button', {name: 'Сохранить'}));

            await waitFor(() => expect(updateModuleAccess).toHaveBeenCalled());
            expect(screen.getByText('Настройки доступа к тесту')).toBeInTheDocument();
        });
    });

    describe('shared test', () => {
        it('loads test and questions by token', async () => {
            const user = userEvent.setup();
            getModuleByToken.mockResolvedValueOnce(makeModule({owner: false}));
            getModuleQuestionsByToken.mockResolvedValueOnce(questionsResponse);

            renderTestPage('/share/public-token');

            await screen.findByRole('heading', {name: 'React test'});
            expect(getModuleByToken).toHaveBeenCalledWith('public-token');
            expect(getModuleById).not.toHaveBeenCalled();

            await user.click(screen.getByRole('button', {name: 'Показать вопросы'}));
            expect(await screen.findByText('Первый вопрос')).toBeInTheDocument();
            expect(getModuleQuestionsByToken).toHaveBeenCalledWith('public-token');
        });

        it('uses guest result from sessionStorage', async () => {
            sessionStorage.setItem('guest_result_public-token', JSON.stringify({
                progress: 3,
                lastUse: '01/06/2026',
            }));
            getModuleByToken.mockResolvedValueOnce(makeModule({owner: false, progress: 0}));

            renderTestPage('/share/public-token');

            expect(await screen.findByText('3 / 3')).toBeInTheDocument();
            expect(screen.getByText(/1 июня 2026/)).toBeInTheDocument();
        });

        it('starts shared quiz', async () => {
            const user = userEvent.setup();
            getModuleByToken.mockResolvedValueOnce(makeModule({owner: false}));

            renderTestPage('/share/public-token');
            await user.click(await screen.findByRole('button', {name: /начать тест/i}));

            expect(screen.getByText('Прохождение теста по ссылке')).toBeInTheDocument();
        });
    });
})
