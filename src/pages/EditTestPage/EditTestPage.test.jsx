import React from 'react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {act, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import EditTestPage from './EditTestPage.jsx';
import {getModuleById, getModuleQuestions, updateModule} from '../../api/modules.js';
import {QUESTION_TYPES} from '../../constants/questionTypes.js';

vi.mock('../../api/modules.js', () => ({
    getModuleById: vi.fn(),
    getModuleQuestions: vi.fn(),
    updateModule: vi.fn(),
}));

const moduleData = {id: 1, name: 'React test', description: 'Описание теста'};

const questionsData = {
    questions: [
        {
            id: 10,
            type: QUESTION_TYPES.INPUT,
            content: 'Что такое React?',
            answers: [{id: 100, content: 'Библиотека', isCorrect: true}],
        },
    ],
};

const choiceQuestionsData = {
    questions: [
        {
            id: 20,
            type: QUESTION_TYPES.CHOICE,
            content: 'Что такое JSX?',
            answers: [
                {id: 200, content: 'Синтаксис', isCorrect: true},
                {id: 201, content: 'База данных', isCorrect: false},
            ],
        },
    ],
};

const silenceConsoleError = () => vi.spyOn(console, 'error').mockImplementation(() => {
});

const renderEditPage = () => render(
    <MemoryRouter initialEntries={['/test/1', '/test/1/edit']} initialIndex={1}>
        <Routes>
            <Route path="/test/:id/edit" element={<EditTestPage/>}/>
            <Route path="/test/:id" element={<div>Страница теста</div>}/>
        </Routes>
    </MemoryRouter>
);

const renderLoaded = async (questions = questionsData) => {
    getModuleById.mockResolvedValue(moduleData);
    getModuleQuestions.mockResolvedValue(questions);
    renderEditPage();
    await screen.findByDisplayValue('React test');
};

const clickSave = (user) => user.click(screen.getByRole('button', {name: /сохранить/i}));
const clickBack = (user) => user.click(screen.getByAltText('Назад'));

const pressBrowserBack = () => act(() => {
    window.dispatchEvent(new PopStateEvent('popstate'));
});


describe('EditTestPage', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('loading', () => {
        it('shows loading state', () => {
            getModuleById.mockReturnValueOnce(new Promise(() => {
            }));

            renderEditPage();

            expect(screen.getByText('Загрузка данных теста...')).toBeInTheDocument();
        });

        it('fills form with loaded data', async () => {
            await renderLoaded();

            expect(screen.getByDisplayValue('Описание теста')).toBeInTheDocument();
            expect(screen.getByText('Вопросы (1)')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Что такое React?')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Библиотека')).toBeInTheDocument();
            expect(getModuleById).toHaveBeenCalledWith(1);
            expect(getModuleQuestions).toHaveBeenCalledWith(1);
        });

        it('fills form with loaded multiple choice question', async () => {
            await renderLoaded(choiceQuestionsData);

            expect(screen.getByDisplayValue('Что такое JSX?')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Синтаксис')).toBeInTheDocument();
            expect(screen.getByDisplayValue('База данных')).toBeInTheDocument();
            expect(screen.queryByPlaceholderText('Введите правильный ответ')).not.toBeInTheDocument();
        });

        it('shows error state when loading fails', async () => {
            silenceConsoleError();
            getModuleById.mockRejectedValueOnce(new Error('fail'));

            renderEditPage();

            expect(await screen.findByText('Не удалось загрузить данные теста')).toBeInTheDocument();
        });
    });

    describe('editing questions', () => {
        it('adds a new empty question', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.click(screen.getByRole('button', {name: /добавить вопрос/i}));

            expect(screen.getByText('Вопросы (2)')).toBeInTheDocument();
            expect(screen.getAllByPlaceholderText('Введите текст вопроса')).toHaveLength(2);
        });

        it('deletes question', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.click(screen.getByAltText('Удалить'));

            expect(screen.getByText('Вопросы (0)')).toBeInTheDocument();
            expect(screen.queryByDisplayValue('Что такое React?')).not.toBeInTheDocument();
        });

        it('switches question to multiple choice with two default options', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.click(screen.getByRole('radio', {name: 'Множественный выбор'}));

            expect(screen.getByDisplayValue('Вариант 1')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Вариант 2')).toBeInTheDocument();
            expect(screen.queryByPlaceholderText('Введите правильный ответ')).not.toBeInTheDocument();
        });

        it('adds an option to a multiple choice question', async () => {
            const user = userEvent.setup();
            await renderLoaded();
            await user.click(screen.getByRole('radio', {name: 'Множественный выбор'}));

            await user.click(screen.getByRole('button', {name: /добавить вариант/i}));

            expect(screen.getByDisplayValue('Вариант 3')).toBeInTheDocument();
        });
    });

    describe('saving', () => {
        it('sends edited data to API and shows success toast', async () => {
            const user = userEvent.setup();
            updateModule.mockResolvedValueOnce({});
            await renderLoaded();

            const questionInput = screen.getByDisplayValue('Что такое React?');
            await user.clear(questionInput);
            await user.type(questionInput, 'Что такое JSX?');
            await clickSave(user);

            await waitFor(() => {
                expect(updateModule).toHaveBeenCalledWith(1, {
                    name: 'React test',
                    description: 'Описание теста',
                    questions: [
                        {
                            questionId: 10,
                            content: 'Что такое JSX?',
                            type: QUESTION_TYPES.INPUT,
                            answers: [{answerId: 100, content: 'Библиотека', isCorrect: true}],
                        },
                    ],
                });
            });
            expect(await screen.findByText('Изменения успешно сохранены')).toBeInTheDocument();
        });

        it('sends choice question without ids for new options', async () => {
            const user = userEvent.setup();
            updateModule.mockResolvedValueOnce({});
            await renderLoaded();

            await user.click(screen.getByRole('radio', {name: 'Множественный выбор'}));
            await clickSave(user);

            await waitFor(() => {
                expect(updateModule).toHaveBeenCalledWith(1, expect.objectContaining({
                    questions: [
                        expect.objectContaining({
                            questionId: 10,
                            type: QUESTION_TYPES.CHOICE,
                            answers: [
                                {answerId: undefined, content: 'Вариант 1', isCorrect: true},
                                {answerId: undefined, content: 'Вариант 2', isCorrect: false},
                            ],
                        }),
                    ],
                }));
            });
        });

        it('does not save when title is empty', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.clear(screen.getByDisplayValue('React test'));
            await clickSave(user);

            expect(screen.getByText('Обязательное поле')).toBeInTheDocument();
            expect(screen.getByText('Проверьте правильность заполнения формы')).toBeInTheDocument();
            expect(updateModule).not.toHaveBeenCalled();
            expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
        });

        it('shows errors for empty new question', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.click(screen.getByRole('button', {name: /добавить вопрос/i}));
            await clickSave(user);

            expect(screen.getAllByText('Обязательное поле')).toHaveLength(2);
            expect(updateModule).not.toHaveBeenCalled();
        });

        it('clears title error when user starts typing', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            const titleInput = screen.getByDisplayValue('React test');
            await user.clear(titleInput);
            await clickSave(user);
            expect(screen.getByText('Обязательное поле')).toBeInTheDocument();

            await user.type(titleInput, 'Н');

            expect(screen.queryByText('Обязательное поле')).not.toBeInTheDocument();
        });

        it('shows error toast when API fails', async () => {
            silenceConsoleError();
            const user = userEvent.setup();
            updateModule.mockRejectedValueOnce(new Error('fail'));
            await renderLoaded();

            await clickSave(user);

            expect(await screen.findByText('Не удалось сохранить изменения. Попробуйте позже')).toBeInTheDocument();
        });
    });

    describe('leaving page', () => {
        it('goes back immediately when nothing changed', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await clickBack(user);

            expect(screen.getByText('Страница теста')).toBeInTheDocument();
        });

        it('asks confirmation when there are unsaved changes and leaves without saving on "Нет"', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.type(screen.getByDisplayValue('React test'), '!');
            await clickBack(user);
            expect(screen.getByText('Есть несохранённые изменения')).toBeInTheDocument();

            await user.click(screen.getByRole('button', {name: 'Нет'}));

            expect(screen.getByText('Страница теста')).toBeInTheDocument();
            expect(updateModule).not.toHaveBeenCalled();
        });

        it('saves and leaves on "Да"', async () => {
            const user = userEvent.setup();
            updateModule.mockResolvedValueOnce({});
            await renderLoaded();

            await user.type(screen.getByDisplayValue('React test'), '!');
            await clickBack(user);
            await user.click(screen.getByRole('button', {name: 'Да'}));

            await waitFor(() => {
                expect(updateModule).toHaveBeenCalledWith(1, expect.objectContaining({name: 'React test!'}));
            });
            expect(await screen.findByText('Страница теста')).toBeInTheDocument();
        });

        it('does not leave when save from modal fails validation', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.clear(screen.getByDisplayValue('React test'));
            await clickBack(user);
            await user.click(screen.getByRole('button', {name: 'Да'}));

            expect(screen.queryByText('Страница теста')).not.toBeInTheDocument();
            expect(screen.getByText('Обязательное поле')).toBeInTheDocument();
        });

        it('does not ask confirmation after changes were saved', async () => {
            const user = userEvent.setup();
            updateModule.mockResolvedValueOnce({});
            await renderLoaded();

            await user.type(screen.getByDisplayValue('React test'), '!');
            await clickSave(user);
            await screen.findByText('Изменения успешно сохранены');

            await clickBack(user);

            expect(screen.queryByText('Есть несохранённые изменения')).not.toBeInTheDocument();
            expect(screen.getByText('Страница теста')).toBeInTheDocument();
        });

        it('asks confirmation on browser back when there are unsaved changes', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.type(screen.getByDisplayValue('React test'), '!');
            pressBrowserBack();

            expect(screen.getByText('Есть несохранённые изменения')).toBeInTheDocument();
            expect(screen.queryByText('Страница теста')).not.toBeInTheDocument();
        });

        it('leaves on browser back when nothing changed', async () => {
            await renderLoaded();

            pressBrowserBack();

            expect(screen.getByText('Страница теста')).toBeInTheDocument();
        });

        it('stays on the page when leaving is cancelled in the modal', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.type(screen.getByDisplayValue('React test'), '!');
            await clickBack(user);
            await user.click(screen.getByRole('button', {name: 'Закрыть'}));

            expect(screen.queryByText('Есть несохранённые изменения')).not.toBeInTheDocument();
            expect(screen.queryByText('Страница теста')).not.toBeInTheDocument();
            expect(updateModule).not.toHaveBeenCalled();

            await clickBack(user);
            expect(screen.getByText('Есть несохранённые изменения')).toBeInTheDocument();
        });
    });

    describe('scroll to top', () => {
        it('scrolls to the top when the button is clicked', async () => {
            const user = userEvent.setup();
            await renderLoaded();

            await user.click(screen.getByRole('button', {name: 'Наверх'}));

            expect(window.scrollTo).toHaveBeenCalledWith({top: 0, behavior: 'smooth'});
        });
    });
});
