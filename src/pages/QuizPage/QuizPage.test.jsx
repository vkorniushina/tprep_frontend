import React from 'react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {act, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes, useLocation} from 'react-router-dom';
import QuizPage from './QuizPage.jsx';
import useQuizSession from '../../hooks/useQuizSession.js';
import useQuizNavigation from '../../hooks/useQuizNavigation.js';
import useQuizAnswer from '../../hooks/useQuizAnswer.js';
import useBackButtonGuard from '../../hooks/useBackButtonGuard.js';
import {startSharedWrongTestSession, startWrongTestSession} from '../../api/testSessions.js';
import {PROFILE_TABS} from '../../constants/profileConstants.js';
import {QUESTION_TYPES} from '../../constants/questionTypes.js';

vi.mock('../../hooks/useQuizSession.js', () => ({default: vi.fn()}));
vi.mock('../../hooks/useQuizNavigation.js', () => ({default: vi.fn()}));
vi.mock('../../hooks/useQuizAnswer.js', () => ({default: vi.fn()}));
vi.mock('../../hooks/useBackButtonGuard.js', () => ({default: vi.fn()}));
vi.mock('../../api/testSessions.js', () => ({
    startWrongTestSession: vi.fn(),
    startSharedWrongTestSession: vi.fn(),
}));

const inputQuestion = {
    id: 1,
    type: QUESTION_TYPES.INPUT,
    content: 'Что такое React?',
    answers: [],
};

const choiceQuestion = {
    id: 2,
    type: QUESTION_TYPES.CHOICE,
    content: 'Что такое JSX?',
    answers: [
        {id: 21, content: 'Синтаксис', isCorrect: true},
        {id: 22, content: 'База данных', isCorrect: false},
    ],
};

const makeResult = (overrides = {}) => ({
    progress: 2,
    questionsCount: 3,
    finished_at: '2026-06-01T10:00:00',
    ...overrides,
});

const setupSession = (overrides = {}) => {
    const session = {
        sessionId: 's1',
        testName: 'React test',
        currentTestId: 1,
        questionsMeta: [{id: 1}, {id: 2}],
        loading: false,
        sessionError: null,
        exitSession: vi.fn().mockResolvedValue(undefined),
        finishSession: vi.fn().mockResolvedValue(makeResult()),
        ...overrides,
    };
    useQuizSession.mockReturnValue(session);
    return session;
};

const setupNavigation = (overrides = {}) => {
    const navigation = {
        currentIndex: 0,
        setCurrentIndex: vi.fn(),
        currentQuestion: inputQuestion,
        questionsCache: {},
        handleNextQuestion: vi.fn(),
        handlePreviousQuestion: vi.fn(),
        navError: null,
        isFirstQuestion: true,
        isLastQuestion: false,
        ...overrides,
    };
    useQuizNavigation.mockReturnValue(navigation);
    return navigation;
};

const setupAnswer = (overrides = {}) => {
    const answer = {
        userAnswer: '',
        selectedAnswers: [],
        isChecked: false,
        isCorrect: false,
        isAnswered: false,
        correctAnswer: '',
        correctAnswerIds: [],
        handleInputChange: vi.fn(),
        handleChoiceSelect: vi.fn(),
        handleCheckAnswer: vi.fn(),
        ...overrides,
    };
    useQuizAnswer.mockReturnValue(answer);
    return answer;
};

const ProfileStub = () => {
    const location = useLocation();
    return <div>Профиль, вкладка: {location.state?.tab}</div>;
};

const renderQuizPage = (entry = '/test/1/quiz') => render(
    <MemoryRouter initialEntries={[entry]}>
        <Routes>
            <Route path="/test/:id/quiz" element={<QuizPage/>}/>
            <Route path="/share/:shareToken/quiz" element={<QuizPage/>}/>
            <Route path="/test/:id" element={<div>Страница теста</div>}/>
            <Route path="/share/:shareToken" element={<div>Страница общего теста</div>}/>
            <Route path="/profile" element={<ProfileStub/>}/>
        </Routes>
    </MemoryRouter>
);

const finishQuiz = async (user, {entry = '/test/1/quiz', result = makeResult(), sessionOverrides = {}} = {}) => {
    const navigation = setupNavigation({isLastQuestion: true});
    const session = setupSession({
        finishSession: vi.fn().mockResolvedValue(result),
        ...sessionOverrides,
    });
    renderQuizPage(entry);

    await user.click(screen.getByRole('button', {name: /завершить/i}));
    await screen.findByText('Результаты теста');

    return {session, navigation};
};

const silenceConsoleError = () => vi.spyOn(console, 'error').mockImplementation(() => {
});

describe('QuizPage', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        setupSession();
        setupNavigation();
        setupAnswer();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
        document.body.style.overflow = '';
    });

    describe('page states', () => {
        it('shows loading state while session is loading', () => {
            setupSession({loading: true});

            renderQuizPage();

            expect(screen.getByText('Загрузка...')).toBeInTheDocument();
        });

        it.each([
            ['session', () => setupSession({sessionError: 'Ошибка сессии'}), 'Ошибка сессии'],
            ['navigation', () => setupNavigation({navError: 'Ошибка вопросов'}), 'Ошибка вопросов'],
        ])('shows %s error', (_, setup, message) => {
            setup();

            renderQuizPage();

            expect(screen.getByText(message)).toBeInTheDocument();
        });

        it('shows question loading state when there is no current question', () => {
            setupNavigation({currentQuestion: null});

            renderQuizPage();

            expect(screen.getByText('Загрузка данных теста...')).toBeInTheDocument();
        });

        it('renders header and current question', () => {
            renderQuizPage();

            expect(screen.getByRole('heading', {name: 'React test'})).toBeInTheDocument();
            expect(screen.getByText('Вопрос 1/2')).toBeInTheDocument();
            expect(screen.getByText('Что такое React?')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Введите ответ')).toBeInTheDocument();
        });
    });

    describe('answering', () => {
        it('passes typed text to handleInputChange', async () => {
            const user = userEvent.setup();
            const answer = setupAnswer();
            renderQuizPage();

            await user.type(screen.getByPlaceholderText('Введите ответ'), 'a');

            expect(answer.handleInputChange).toHaveBeenCalledWith('a');
        });

        it('adds clicked option to selected answers for choice question', async () => {
            const user = userEvent.setup();
            setupNavigation({currentQuestion: choiceQuestion});
            const answer = setupAnswer({selectedAnswers: [21]});
            renderQuizPage();

            await user.click(screen.getByText('База данных'));

            expect(answer.handleChoiceSelect).toHaveBeenCalledWith([21, 22]);
        });

        it('shows check button only when answered and not checked yet', () => {
            setupAnswer({isAnswered: false});
            const {unmount} = renderQuizPage();
            expect(screen.queryByRole('button', {name: /проверить/i})).not.toBeInTheDocument();
            unmount();

            setupAnswer({isAnswered: true, isChecked: true});
            const second = renderQuizPage();
            expect(screen.queryByRole('button', {name: /проверить/i})).not.toBeInTheDocument();
            second.unmount();

            setupAnswer({isAnswered: true, isChecked: false});
            renderQuizPage();
            expect(screen.getByRole('button', {name: /проверить/i})).toBeInTheDocument();
        });

        it('saves checked answer record to user answers and session storage', async () => {
            const user = userEvent.setup();
            const record = {answer: 'Библиотека', isCorrect: true};
            const answer = setupAnswer({isAnswered: true, handleCheckAnswer: vi.fn().mockResolvedValue(record)});
            renderQuizPage();

            await user.click(screen.getByRole('button', {name: /проверить/i}));

            expect(answer.handleCheckAnswer).toHaveBeenCalledTimes(1);
            await waitFor(() => {
                expect(JSON.parse(sessionStorage.getItem('quizState_1')).userAnswers).toEqual({1: record});
            });
        });

        it('shows error when checking answer fails', async () => {
            silenceConsoleError();
            const user = userEvent.setup();
            setupAnswer({isAnswered: true, handleCheckAnswer: vi.fn().mockRejectedValue(new Error('fail'))});
            renderQuizPage();

            await user.click(screen.getByRole('button', {name: /проверить/i}));

            expect(await screen.findByText('Произошла ошибка. Попробуйте ещё раз.')).toBeInTheDocument();
        });

        it('shows feedback and correct answer after wrong answer was checked', () => {
            setupAnswer({
                userAnswer: 'Фреймворк',
                isAnswered: true,
                isChecked: true,
                isCorrect: false,
                correctAnswer: 'Библиотека',
            });

            renderQuizPage();

            expect(screen.getByText('Ошибки случаются!')).toBeInTheDocument();
            expect(screen.getByText('Библиотека')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Введите ответ')).toBeDisabled();
        });
    });

    describe('navigation between questions', () => {
        it('goes to next and previous question', async () => {
            const user = userEvent.setup();
            const navigation = setupNavigation({isFirstQuestion: false});
            renderQuizPage();

            await user.click(screen.getByRole('button', {name: 'Следующий вопрос'}));
            await user.click(screen.getByRole('button', {name: 'Предыдущий вопрос'}));

            expect(navigation.handleNextQuestion).toHaveBeenCalledTimes(1);
            expect(navigation.handlePreviousQuestion).toHaveBeenCalledTimes(1);
        });

        it('shows finish button instead of next on the last question', () => {
            setupNavigation({isLastQuestion: true});

            renderQuizPage();

            expect(screen.getByRole('button', {name: /завершить/i})).toBeInTheDocument();
            expect(screen.queryByRole('button', {name: 'Следующий вопрос'})).not.toBeInTheDocument();
        });
    });

    describe('session storage', () => {
        it('persists quiz state when session exists', () => {
            setupNavigation({currentIndex: 1, questionsCache: {1: inputQuestion}});

            renderQuizPage();

            expect(JSON.parse(sessionStorage.getItem('quizState_1'))).toEqual({
                sessionId: 's1',
                testName: 'React test',
                currentTestId: 1,
                userAnswers: {},
                currentIndex: 1,
                questionsCache: {1: inputQuestion},
                questionsMeta: [{id: 1}, {id: 2}],
            });
        });

        it('does not persist quiz state before session is created', () => {
            setupSession({sessionId: null});

            renderQuizPage();

            expect(sessionStorage.getItem('quizState_1')).toBeNull();
        });

        it('restores saved state and passes it to hooks', () => {
            const saved = {sessionId: 's1', userAnswers: {1: {answer: 'x'}}, currentIndex: 1};
            sessionStorage.setItem('quizState_1', JSON.stringify(saved));

            renderQuizPage();

            expect(useQuizSession.mock.calls[0][2]).toEqual(saved);
            expect(useQuizAnswer.mock.calls.at(-1)[2]).toEqual({1: {answer: 'x'}});
        });

        it('ignores saved state and resets progress when a new session was passed', () => {
            const newSession = {sessionId: 's2'};
            const navigation = setupNavigation();
            sessionStorage.setItem('quizState_1', JSON.stringify({userAnswers: {1: {answer: 'x'}}}));

            renderQuizPage({pathname: '/test/1/quiz', state: {session: newSession}});

            expect(useQuizSession.mock.calls[0][2]).toBeNull();
            expect(useQuizSession.mock.calls[0][3]).toEqual(newSession);
            expect(navigation.setCurrentIndex).toHaveBeenCalledWith(0);
            expect(useQuizAnswer.mock.calls.at(-1)[2]).toEqual({});
        });
    });

    describe('lock after leaving', () => {
        it('redirects to test page when quiz is locked', async () => {
            sessionStorage.setItem('quiz_locked_1', 'true');

            renderQuizPage();

            expect(await screen.findByText('Страница теста')).toBeInTheDocument();
        });

        it('redirects to shared test page when shared quiz is locked', async () => {
            sessionStorage.setItem('quiz_locked_public-token', 'true');

            renderQuizPage('/share/public-token/quiz');

            expect(await screen.findByText('Страница общего теста')).toBeInTheDocument();
        });
    });

    describe('exit', () => {
        it('asks confirmation and stays on cancel', async () => {
            const user = userEvent.setup();
            const session = setupSession();
            renderQuizPage();

            await user.click(screen.getByRole('button', {name: 'Выйти из теста'}));
            expect(screen.getByText('Вы точно хотите выйти?')).toBeInTheDocument();

            await user.click(screen.getByRole('button', {name: 'Остаться'}));

            expect(screen.queryByText('Вы точно хотите выйти?')).not.toBeInTheDocument();
            expect(session.exitSession).not.toHaveBeenCalled();
            expect(screen.getByText('Что такое React?')).toBeInTheDocument();
        });

        it('exits session, clears progress, locks quiz and goes back to test page', async () => {
            const user = userEvent.setup();
            const session = setupSession();
            renderQuizPage();

            await user.click(screen.getByRole('button', {name: 'Выйти из теста'}));
            await user.click(screen.getByRole('button', {name: 'Выйти'}));

            expect(await screen.findByText('Страница теста')).toBeInTheDocument();
            expect(session.exitSession).toHaveBeenCalledTimes(1);
            expect(sessionStorage.getItem('quizState_1')).toBeNull();
            expect(sessionStorage.getItem('quiz_locked_1')).toBe('true');
        });

        it('returns to originPath from location state', async () => {
            const user = userEvent.setup();
            renderQuizPage({pathname: '/test/1/quiz', state: {originPath: '/profile'}});

            await user.click(screen.getByRole('button', {name: 'Выйти из теста'}));
            await user.click(screen.getByRole('button', {name: 'Выйти'}));

            expect(await screen.findByText(/Профиль/)).toBeInTheDocument();
        });

        it('opens exit confirmation on browser back', () => {
            renderQuizPage();

            const [onBack] = useBackButtonGuard.mock.calls.at(-1);
            act(() => onBack());

            expect(screen.getByText('Вы точно хотите выйти?')).toBeInTheDocument();
        });
    });

    describe('finishing test', () => {
        it('shows result modal and blocks body scroll', async () => {
            const user = userEvent.setup();

            const {session} = await finishQuiz(user);

            expect(session.finishSession).toHaveBeenCalledTimes(1);
            expect(screen.getByText('2/3')).toBeInTheDocument();
            expect(screen.getByText('67%')).toBeInTheDocument();
            expect(document.body.style.overflow).toBe('hidden');
        });

        it('shows error when finishing fails', async () => {
            silenceConsoleError();
            const user = userEvent.setup();
            setupNavigation({isLastQuestion: true});
            setupSession({finishSession: vi.fn().mockRejectedValue(new Error('fail'))});
            renderQuizPage();

            await user.click(screen.getByRole('button', {name: /завершить/i}));

            expect(await screen.findByText('Не удалось завершить тест')).toBeInTheDocument();
            expect(screen.queryByText('Результаты теста')).not.toBeInTheDocument();
        });

        it('does not save guest result for own tests', async () => {
            const user = userEvent.setup();

            await finishQuiz(user);

            expect(sessionStorage.getItem('guest_result_public-token')).toBeNull();
        });

        it('saves guest result for shared tests', async () => {
            const user = userEvent.setup();

            await finishQuiz(user, {entry: '/share/public-token/quiz'});

            expect(JSON.parse(sessionStorage.getItem('guest_result_public-token'))).toEqual({
                progress: 2,
                lastUse: '2026-06-01T10:00:00',
            });
        });

        it('hides "fix errors" button when all answers are correct', async () => {
            const user = userEvent.setup();

            await finishQuiz(user, {result: makeResult({progress: 3, questionsCount: 3})});

            expect(screen.getByText('100%')).toBeInTheDocument();
            expect(screen.queryByRole('button', {name: /исправить ошибки/i})).not.toBeInTheDocument();
        });
    });

    describe('result modal actions', () => {
        it('closes result: clears progress, locks quiz and goes to test page', async () => {
            const user = userEvent.setup();
            await finishQuiz(user);
            expect(sessionStorage.getItem('quizState_1')).not.toBeNull();

            await user.click(screen.getByRole('button', {name: 'Закрыть'}));

            expect(await screen.findByText('Страница теста')).toBeInTheDocument();
            expect(sessionStorage.getItem('quizState_1')).toBeNull();
            expect(sessionStorage.getItem('quiz_locked_1')).toBe('true');
        });

        it('starts a wrong-answers session and resets the quiz', async () => {
            const user = userEvent.setup();
            const newSession = {sessionId: 's2'};
            startWrongTestSession.mockResolvedValueOnce(newSession);
            const {session, navigation} = await finishQuiz(user);
            useQuizSession.mockImplementation((_id, _token, _saved, passedSession) =>
                passedSession ? {...session, sessionId: passedSession.sessionId} : session);

            await user.click(screen.getByRole('button', {name: /исправить ошибки/i}));

            await waitFor(() => expect(startWrongTestSession).toHaveBeenCalledWith('s1'));
            expect(screen.queryByText('Результаты теста')).not.toBeInTheDocument();
            await waitFor(() => {
                expect(useQuizSession.mock.calls.at(-1)[3]).toEqual(newSession);
            });
            expect(navigation.setCurrentIndex).toHaveBeenCalledWith(0);
            await waitFor(() => {
                expect(JSON.parse(sessionStorage.getItem('quizState_1')).sessionId).toBe('s2');
            });
        });

        it('starts a shared wrong-answers session for shared tests', async () => {
            const user = userEvent.setup();
            startSharedWrongTestSession.mockResolvedValueOnce({sessionId: 's2', shareToken: 'public-token'});
            await finishQuiz(user, {entry: '/share/public-token/quiz'});

            await user.click(screen.getByRole('button', {name: /исправить ошибки/i}));

            await waitFor(() => {
                expect(startSharedWrongTestSession).toHaveBeenCalledWith('public-token', 's1');
            });
            expect(startWrongTestSession).not.toHaveBeenCalled();
            expect(screen.queryByText('Результаты теста')).not.toBeInTheDocument();
        });

        it('shows error when starting wrong-answers session fails', async () => {
            silenceConsoleError();
            const user = userEvent.setup();
            startWrongTestSession.mockRejectedValueOnce(new Error('fail'));
            await finishQuiz(user);

            await user.click(screen.getByRole('button', {name: /исправить ошибки/i}));

            expect(await screen.findByText('Не удалось начать исправление ошибок')).toBeInTheDocument();
        });

        it('restarts the quiz: clears progress and reloads the page', async () => {
            const user = userEvent.setup();

            const reload = vi.fn();
            vi.stubGlobal('location', {...window.location, reload});
            await finishQuiz(user);

            await user.click(screen.getByRole('button', {name: 'Пройти тест заново'}));

            expect(sessionStorage.getItem('quizState_1')).toBeNull();
            expect(reload).toHaveBeenCalledTimes(1);
        });

        it('opens reminders in profile for own tests', async () => {
            const user = userEvent.setup();
            await finishQuiz(user);

            await user.click(screen.getByRole('button', {name: 'Настроить напоминания'}));

            expect(await screen.findByText(`Профиль, вкладка: ${PROFILE_TABS.REMINDERS}`)).toBeInTheDocument();
            expect(sessionStorage.getItem('quizState_1')).toBeNull();
            expect(sessionStorage.getItem('quiz_locked_1')).toBe('true');
        });

        it('does not offer reminders for shared tests', async () => {
            const user = userEvent.setup();

            await finishQuiz(user, {entry: '/share/public-token/quiz'});

            expect(screen.queryByRole('button', {name: 'Настроить напоминания'})).not.toBeInTheDocument();
        });
    });
});
