import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import styles from './QuizPage.module.scss';
import HeaderQuiz from '../../components/HeaderQuiz/HeaderQuiz';
import FooterQuiz from '../../components/FooterQuiz/FooterQuiz';
import {getModuleQuestionsLight} from "../../api/modules.js";
import {createTestSession, finishTestSession, startWrongTestSession} from "../../api/testSessions.js";
import {getQuestionById} from "../../api/questions.js";
import TestState from "../../components/TestState/TestState.jsx";
import ExitConfirmModal from "../../components/ExitConfirmModal/ExitConfirmModal.jsx";
import ResultModal from "../../components/ResultModal/ResultModal.jsx";
import QuestionContainer from "../../components/QuestionContainer/QuestionContainer.jsx";
import useBackButtonGuard from "../../hooks/useBackButtonGuard.js";
import useQuizAnswer from "../../hooks/useQuizAnswer.js";

const QuizPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const passedSession = location.state?.session;

    const [sessionId, setSessionId] = useState(null);
    const [questionsMeta, setQuestionsMeta] = useState([]);
    const [questionsCache, setQuestionsCache] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [testName, setTestName] = useState('');
    const [currentTestId, setCurrentTestId] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [exitOpen, setExitOpen] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);

    const STORAGE_KEY = `quizState_${id}`;

    const currentQuestionMeta = questionsMeta[currentIndex];
    const currentQuestion = currentQuestionMeta
        ? questionsCache[currentQuestionMeta.id]
        : null;

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
    } = useQuizAnswer(currentQuestion, sessionId, userAnswers);

    useBackButtonGuard(() => setExitOpen(true));

    useEffect(() => {
        const initTest = async () => {
            try {
                setLoading(true);

                if (passedSession) {
                    setSessionId(passedSession.sessionId);
                    setTestName(passedSession.testName);
                    setCurrentTestId(passedSession.testId);

                    setUserAnswers({});
                    setCurrentIndex(0);
                    setQuestionsCache({});

                    const meta = await getModuleQuestionsLight(passedSession.testId);
                    setQuestionsMeta(meta.questions);

                    setError(null);
                    setLoading(false);
                    return;
                }

                const saved = sessionStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setSessionId(parsed.sessionId);
                    setTestName(parsed.testName);
                    setCurrentTestId(parsed.currentTestId || Number(id));
                    setUserAnswers(parsed.userAnswers || {});
                    setCurrentIndex(parsed.currentIndex || 0);
                    setQuestionsCache(parsed.questionsCache || {});
                    setQuestionsMeta(parsed.questionsMeta || []);
                    setLoading(false);
                    return;
                }

                const session = await createTestSession(Number(id));
                setSessionId(session.sessionId);
                setTestName(session.testName);
                setCurrentTestId(Number(id));

                const meta = await getModuleQuestionsLight(Number(id));
                setQuestionsMeta(meta.questions);

                setError(null);
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить тест');
            } finally {
                setLoading(false);
            }
        };

        if (id) initTest();
    }, [id, passedSession]);

    useEffect(() => {
        const fetchQuestion = async () => {
            const currentMeta = questionsMeta[currentIndex];
            if (!currentMeta) return;

            const questionId = currentMeta.id;

            if (!questionsCache[questionId]) {
                try {
                    const data = await getQuestionById(questionId);
                    setQuestionsCache(prev => ({...prev, [questionId]: data}));
                } catch (err) {
                    console.error(`Error loading question ${questionId}`, err);
                    setError('Не удалось загрузить вопрос');
                }
            }
        };

        if (questionsMeta.length > 0) fetchQuestion();
    }, [currentIndex, questionsMeta]);

    useEffect(() => {
        if (!sessionId) return;

        const savedState = {
            sessionId,
            testName,
            currentTestId,
            userAnswers,
            currentIndex,
            questionsCache,
            questionsMeta,
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    }, [sessionId, testName, currentTestId, userAnswers, currentIndex, questionsCache, questionsMeta]);

    useEffect(() => {
        document.body.style.overflow = showResultModal ? "hidden" : "";
    }, [showResultModal]);

    const handleNextQuestion = () => {
        if (currentIndex < questionsMeta.length - 1) setCurrentIndex(currentIndex + 1);
    };

    const handlePreviousQuestion = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const handleRequestExit = () => setExitOpen(true);

    const handleCancelExit = () => setExitOpen(false);

    const handleExit = async () => {
        try {
            await finishTestSession(sessionId);
        } catch (err) {
            console.error("Error finishing session on exit", err);
        }
        sessionStorage.removeItem(STORAGE_KEY);
        navigate(`/test/${id}`);
    };

    const handleFinishTest = async () => {
        try {
            const result = await finishTestSession(sessionId);
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

            const newSession = await startWrongTestSession(sessionId);

            navigate(`/test/${id}/quiz`, {
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

    if (loading) return <TestState type="loading" message="Загрузка теста..."/>;
    if (error) return <TestState type="error" message={error}/>;
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
                isPreviousDisabled={currentIndex === 0}
                showCheckButton={isAnswered && !isChecked}
                onCheckAnswer={handleCheckAnswerWithSave}
                isLastQuestion={currentIndex === questionsMeta.length - 1}
                onFinishTest={handleFinishTest}
            />

            {showResultModal && (
                <ResultModal
                    result={resultData}
                    onRetry={() => {
                        sessionStorage.removeItem(STORAGE_KEY);
                        setShowResultModal(false);
                        navigate(0);
                    }}
                    onFixErrors={handleFixErrors}
                    onClose={handleExit}
                />
            )}
        </div>
    );
};

export default QuizPage;
