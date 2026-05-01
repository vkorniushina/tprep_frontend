import React, {useState, useEffect, useMemo} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import styles from './QuizPage.module.scss';
import HeaderQuiz from '../../components/HeaderQuiz/HeaderQuiz';
import FooterQuiz from '../../components/FooterQuiz/FooterQuiz';
import {startSharedWrongTestSession, startWrongTestSession} from "../../api/testSessions.js";
import TestState from "../../components/TestState/TestState.jsx";
import ExitConfirmModal from "../../components/ExitConfirmModal/ExitConfirmModal.jsx";
import ResultModal from "../../components/ResultModal/ResultModal.jsx";
import QuestionContainer from "../../components/QuestionContainer/QuestionContainer.jsx";
import useBackButtonGuard from "../../hooks/useBackButtonGuard.js";
import useQuizAnswer from "../../hooks/useQuizAnswer.js";
import useQuizNavigation from "../../hooks/useQuizNavigation.js";
import useQuizSession from "../../hooks/useQuizSession.js";
import {PROFILE_TABS} from "../../constants/profileConstants.js";

const QuizPage = () => {
    const {id, shareToken} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const identifier = id || shareToken;
    const basePath = shareToken ? `/share/${shareToken}` : `/test/${id}`;

    const passedSession = location.state?.session;

    const STORAGE_KEY = `quizState_${identifier}`;
    const LOCK_KEY = `quiz_locked_${identifier}`;

    const savedState = useMemo(() => {
        if (passedSession) return null;
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    }, []);

    const [userAnswers, setUserAnswers] = useState(savedState?.userAnswers || {});
    const [error, setError] = useState(null);
    const [exitOpen, setExitOpen] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);

    const {
        sessionId,
        testName,
        currentTestId,
        questionsMeta,
        loading,
        sessionError,
        exitSession,
        finishSession,
    } = useQuizSession(id, shareToken, savedState, passedSession);

    const {
        currentIndex,
        setCurrentIndex,
        currentQuestion,
        questionsCache,
        handleNextQuestion,
        handlePreviousQuestion,
        navError,
        isFirstQuestion,
        isLastQuestion,
    } = useQuizNavigation(questionsMeta, savedState, shareToken);

    const {
        userAnswer,
        selectedAnswers,
        isChecked,
        isCorrect,
        isAnswered,
        correctAnswer,
        correctAnswerIds,
        handleInputChange,
        handleChoiceSelect,
        handleCheckAnswer,
    } = useQuizAnswer(currentQuestion, sessionId, userAnswers, shareToken);

    useBackButtonGuard(() => setExitOpen(true));

    useEffect(() => {
        if (sessionStorage.getItem(LOCK_KEY)) {
            navigate(basePath, { replace: true });
        }
    }, [basePath, navigate]);

    useEffect(() => {
        if (passedSession) {
            setUserAnswers({});
            setCurrentIndex(0);
        }
    }, [passedSession]);

    useEffect(() => {
        if (!sessionId) return;

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            sessionId,
            testName,
            currentTestId,
            userAnswers,
            currentIndex,
            questionsCache,
            questionsMeta,
        }));
    }, [sessionId, testName, currentTestId, userAnswers, currentIndex, questionsCache, questionsMeta]);

    useEffect(() => {
        document.body.style.overflow = showResultModal ? "hidden" : "";
    }, [showResultModal]);

    const handleRequestExit = () => setExitOpen(true);

    const handleCancelExit = () => setExitOpen(false);

    const handleExit = async () => {
        await exitSession();
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.setItem(LOCK_KEY, "true");
        navigate(basePath);
    };

    const handleFinishTest = async () => {
        try {
            const result = await finishSession();
            setResultData(result);
            setShowResultModal(true);
        } catch (err) {
            console.error('Error finishing test', err);
            setError('Не удалось завершить тест');
        }
    };

    const handleCheckAnswerWithSave = async () => {
        try {
            const answerRecord = await handleCheckAnswer();
            if (answerRecord) {
                setUserAnswers(prev => ({...prev, [currentQuestion.id]: answerRecord}));
            }
        } catch (err) {
            console.error('Error submitting answer', err);
            setError('Произошла ошибка. Попробуйте ещё раз.');
        }
    };

    const handleFixErrors = async () => {
        try {
            setShowResultModal(false);
            sessionStorage.removeItem(STORAGE_KEY);

            const newSession = shareToken
                ? await startSharedWrongTestSession(shareToken, sessionId)
                : await startWrongTestSession(sessionId);

            navigate(`${basePath}/quiz`, {
                replace: true,
                state: {
                    session: newSession
                }
            });
        } catch (err) {
            console.error('Error starting fix mode', err);
            setError('Не удалось начать исправление ошибок');
        }
    };

    const handleRetry = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        navigate(`${basePath}/quiz`, {replace: true, state: null});
        window.location.reload();
    };

    const handleOpenReminders = () => {
        if (shareToken) {
            return;
        }

        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.setItem(LOCK_KEY, "true");

        navigate("/profile", {
            state: { tab: PROFILE_TABS.REMINDERS },
            replace: true
        });
    };

    if (loading) return <TestState type="loading" message="Загрузка теста..."/>;
    if (error || navError || sessionError) return <TestState type="error" message={error || navError || sessionError}/>;
    if (!currentQuestion) return <TestState type="loading" message="Загрузка вопроса..."/>;

    return (
        <div className={styles.quizContainer}>
            <HeaderQuiz
                testName={testName}
                currentQuestion={currentIndex + 1}
                totalQuestions={questionsMeta.length}
                onExitClick={handleRequestExit}
            />

            <ExitConfirmModal
                open={exitOpen}
                onCancel={handleCancelExit}
                onConfirm={handleExit}
            />

            <main className={`container ${styles.main}`}>
                <QuestionContainer
                    question={currentQuestion}
                    userAnswer={userAnswer}
                    selectedAnswers={selectedAnswers}
                    isChecked={isChecked}
                    isCorrect={isCorrect}
                    correctAnswer={correctAnswer}
                    correctAnswerIds={correctAnswerIds}
                    onInputChange={handleInputChange}
                    onChoiceSelect={handleChoiceSelect}
                />
            </main>

            <FooterQuiz
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                isPreviousDisabled={isFirstQuestion}
                showCheckButton={isAnswered && !isChecked}
                onCheckAnswer={handleCheckAnswerWithSave}
                isLastQuestion={isLastQuestion}
                onFinishTest={handleFinishTest}
            />

            {showResultModal && (
                <ResultModal
                    result={resultData}
                    onRetry={handleRetry}
                    onFixErrors={handleFixErrors}
                    onClose={handleExit}
                    onOpenReminders={!shareToken ? handleOpenReminders : undefined}
                />
            )}
        </div>
    );
};

export default QuizPage;
