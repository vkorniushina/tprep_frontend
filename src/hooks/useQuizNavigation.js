import {useState, useEffect} from 'react';
import {getQuestionById} from '../api/questions.js';

const useQuizNavigation = (questionsMeta, savedState) => {
    const [currentIndex, setCurrentIndex] = useState(savedState?.currentIndex || 0);
    const [questionsCache, setQuestionsCache] = useState(savedState?.questionsCache || {});
    const [error, setError] = useState(null);

    const currentQuestionMeta = questionsMeta[currentIndex];
    const currentQuestion = currentQuestionMeta
        ? questionsCache[currentQuestionMeta.id]
        : null;

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

    const handleNextQuestion = () => {
        if (currentIndex < questionsMeta.length - 1) setCurrentIndex(currentIndex + 1);
    };

    const handlePreviousQuestion = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    return {
        currentIndex,
        setCurrentIndex,
        currentQuestion,
        questionsCache,
        handleNextQuestion,
        handlePreviousQuestion,
        navError: error,
        isFirstQuestion: currentIndex === 0,
        isLastQuestion: currentIndex === questionsMeta.length - 1,
    };
};

export default useQuizNavigation;
