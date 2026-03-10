import {useState, useEffect} from 'react';
import {submitAnswer} from '../api/testSessions.js';
import {QUESTION_TYPES} from '../constants/questionTypes.js';

const useQuizAnswer = (currentQuestion, sessionId, userAnswers) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [correctAnswerIds, setCorrectAnswerIds] = useState([]);

    useEffect(() => {
        if (!currentQuestion) return;

        const saved = userAnswers[currentQuestion.id];
        if (saved) {
            setUserAnswer(saved.userAnswer || '');
            setSelectedAnswers(saved.selectedAnswers || []);
            setIsChecked(true);
            setIsCorrect(saved.isCorrect);
            setCorrectAnswer(saved.correctAnswer || null);
            setCorrectAnswerIds(saved.correctAnswerIds || []);
            setIsAnswered(true);
        } else {
            setUserAnswer('');
            setSelectedAnswers([]);
            setIsChecked(false);
            setIsCorrect(false);
            setCorrectAnswer(null);
            setCorrectAnswerIds([]);
            setIsAnswered(false);
        }
    }, [currentQuestion]);

    const handleInputChange = (value) => {
        setUserAnswer(value);
        setIsAnswered(value.trim().length > 0);
    };

    const handleChoiceSelect = (selectedIds) => {
        setSelectedAnswers(selectedIds);
        setIsAnswered(selectedIds.length > 0);
    };

    const handleCheckAnswer = async () => {
        if (!currentQuestion || !sessionId) return null;

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
            setCorrectAnswerIds(correctAnswer);
        }

        return {
            userAnswer,
            selectedAnswers,
            isCorrect,
            type: currentQuestion.type,
            correctAnswer,
            correctAnswerIds: currentQuestion.type === QUESTION_TYPES.INPUT ? [] : correctAnswer,
        };
    };

    return {
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
    };
};

export default useQuizAnswer
