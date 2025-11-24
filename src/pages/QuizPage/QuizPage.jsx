import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import styles from './QuizPage.module.scss';
import QuestionInputForm from '../../components/QuestionInputForm/QuestionInputForm';
import QuestionChoiceForm from '../../components/QuestionChoiceForm/QuestionChoiceForm';
import HeaderQuiz from '../../components/HeaderQuiz/HeaderQuiz';
import FooterQuiz from '../../components/FooterQuiz/FooterQuiz';
import {getModuleQuestionsLight} from "../../api/modules.js";
import {createTestSession, finishTestSession, submitAnswer} from "../../api/testSessions.js";
import {getQuestionById} from "../../api/questions.js";
import {QUESTION_TYPES} from "../../constants/questionTypes.js";
import TestState from "../../components/TestState/TestState.jsx";
import ExitConfirmModal from "../../components/ExitConfirmModal/ExitConfirmModal.jsx";
import ResultModal from "../../components/ResultModal/ResultModal.jsx";

const QuizPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [sessionId, setSessionId] = useState(null);
    const [questionsMeta, setQuestionsMeta] = useState([]);
    const [questionsCache, setQuestionsCache] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [testName, setTestName] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [userAnswers, setUserAnswers] = useState({});
    const [userAnswer, setUserAnswer] = useState('');
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [correctAnswerIds, setCorrectAnswerIds] = useState([]);

    const [exitOpen, setExitOpen] = useState(false);

    const [isFinished, setIsFinished] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);

    const STORAGE_KEY = `quizState_${id}`;

    useEffect(() => {
        const initTest = async () => {
            try {
                setLoading(true);

                const saved = sessionStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setSessionId(parsed.sessionId);
                    setTestName(parsed.testName);
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
    }, [id]);

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

            const saved = userAnswers[questionId];
            if (saved) {
                setUserAnswer(saved.userAnswer || '');
                setSelectedAnswers(saved.selectedAnswers || []);
                setIsChecked(true);
                setIsCorrect(saved.isCorrect);
                setCorrectAnswer(saved.correctAnswer || null);
                setCorrectAnswerIds(saved.correctAnswerIds || []);
                setIsAnswered(true);
            } else {
                resetQuestionState();
            }
        };

        if (questionsMeta.length > 0) {
            fetchQuestion();
        }
    }, [currentIndex, questionsMeta, userAnswers]);

    useEffect(() => {
        if (!sessionId) return;

        const savedState = {
            sessionId,
            testName,
            userAnswers,
            currentIndex,
            questionsCache,
            questionsMeta,
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    }, [sessionId, testName, userAnswers, currentIndex, questionsCache, questionsMeta]);

    useEffect(() => {
        const blockBack = (e) => {
            e.preventDefault();
            window.history.pushState(null, "", window.location.href);
            setExitOpen(true);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", blockBack);

        return () => window.removeEventListener("popstate", blockBack);
    }, []);

    useEffect(() => {
        if (showResultModal) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [showResultModal]);

    const currentQuestionMeta = questionsMeta[currentIndex];
    const currentQuestion = currentQuestionMeta
        ? questionsCache[currentQuestionMeta.id]
        : null;

    const handleInputChange = (value) => {
        setUserAnswer(value);
        setIsAnswered(value.trim().length > 0);
    };

    const handleChoiceSelect = (selectedIds) => {
        setSelectedAnswers(selectedIds);
        setIsAnswered(selectedIds.length > 0);
    };

    const handleCheckAnswer = async () => {
        if (!currentQuestion || !sessionId) return;

        try {
            const result = await submitAnswer(sessionId, {
                questionId: currentQuestion.id,
                userAnswer: currentQuestion.type === QUESTION_TYPES.INPUT
                    ? [userAnswer]
                    : selectedAnswers.map(Number),
            });
            const {isCorrect, correctAnswer} = result;
            setIsCorrect(isCorrect);
            setIsChecked(true);

            if (!isCorrect) {
                if (currentQuestion.type === QUESTION_TYPES.INPUT) {
                    setCorrectAnswer(correctAnswer);
                    setCorrectAnswerIds([]);
                } else {
                    setCorrectAnswer(null);
                    setCorrectAnswerIds(correctAnswer);
                }
            } else {
                setCorrectAnswer(null);
                setCorrectAnswerIds([]);
            }

            setUserAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: {
                    userAnswer,
                    selectedAnswers,
                    isCorrect: isCorrect,
                    type: currentQuestion.type,
                    correctAnswer: correctAnswer,
                    correctAnswerIds: currentQuestion.type === QUESTION_TYPES.INPUT ? [] : correctAnswer,
                },
            }));

        } catch (err) {
            console.error('Error submitting answer', err);
            setError('Произошла ошибка. Попробуйте ещё раз.');
        }
    };

    const handleNextQuestion = () => {
        if (currentIndex < questionsMeta.length - 1) setCurrentIndex(currentIndex + 1);
    };

    const handlePreviousQuestion = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const resetQuestionState = () => {
        setUserAnswer('');
        setSelectedAnswers([]);
        setIsChecked(false);
        setIsCorrect(false);
        setCorrectAnswer(null);
        setCorrectAnswerIds([]);
        setIsAnswered(false);
    };

    const handleRequestExit = () => {
        setExitOpen(true);
    };

    const handleCancelExit = () => {
        setExitOpen(false);
    };

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
            setIsFinished(true);
            setShowResultModal(true);
        } catch (err) {
            console.error('Error finishing test:', err);
            setError('Не удалось завершить тест');
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
                <div className={styles.questionContainer}>
                    <h2 className={styles.questionText}>
                        {currentQuestion.content}
                    </h2>

                    <div className={styles.answerForm}>
                        {currentQuestion.type === QUESTION_TYPES.INPUT ? (
                            <QuestionInputForm
                                value={userAnswer}
                                onChange={handleInputChange}
                                disabled={isChecked}
                                isChecked={isChecked}
                                isCorrect={isCorrect}
                                correctAnswer={correctAnswer}
                            />
                        ) : (
                            <QuestionChoiceForm
                                answers={currentQuestion.answers}
                                selected={selectedAnswers}
                                onSelect={handleChoiceSelect}
                                disabled={isChecked}
                                isChecked={isChecked}
                                correctAnswers={correctAnswerIds}
                            />
                        )}
                    </div>

                </div>
            </main>

            <FooterQuiz
                onPrevious={handlePreviousQuestion}
                onNext={handleNextQuestion}
                isPreviousDisabled={currentIndex === 0}
                showCheckButton={isAnswered && !isChecked}
                onCheckAnswer={handleCheckAnswer}
                isLastQuestion={currentIndex === questionsMeta.length - 1}
                onFinishTest={handleFinishTest}
            />

            {showResultModal && (
                <ResultModal
                    result={resultData}
                    onRetry={() => {
                        sessionStorage.removeItem(STORAGE_KEY);
                        setShowResultModal(false);
                        setIsFinished(false);
                        navigate(0);
                    }}
                    onClose={handleExit}
                />
            )}
        </div>
    );
};

export default QuizPage;
