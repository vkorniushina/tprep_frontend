import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import HeaderTest from "../../components/HeaderTest/HeaderTest";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import styles from "./TestPage.module.scss";
import {getModuleById, getModuleQuestions} from "../../api/modules.js";
import QuestionBlock from "../../components/QuestionBlock/QuestionBlock.jsx";
import TestState from "../../components/TestState/TestState.jsx";

const TestPage = () => {
    const [showQuestions, setShowQuestions] = useState(false);
    const [testData, setTestData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState({
        test: true,
        questions: false
    });

    const [error, setError] = useState({
        test: null,
        questions: null,
    });

    const {id} = useParams();

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                setLoading(prev => ({...prev, test: true}));
                const data = await getModuleById(Number(id));
                setTestData(data);
                setError((prev) => ({...prev, test: null}));
            } catch (err) {
                setError((prev) => ({
                    ...prev, test: "Не удалось загрузить информацию о тесте"
                }));
                console.error('Error fetching test data:', err);
            } finally {
                setLoading(prev => ({...prev, test: false}));
            }
        };

        if (id) {
            fetchTestData();
        }
    }, [id]);

    const fetchQuestions = async () => {
        try {
            setLoading(prev => ({...prev, questions: true}));
            const questionsData = await getModuleQuestions(Number(id));
            setQuestions(questionsData.questions);
            setError((prev) => ({...prev, questions: null}));
        } catch (err) {
            setError((prev) => ({
                ...prev, questions: "Не удалось загрузить вопросы теста"
            }));
            console.error('Error fetching questions:', err);
        } finally {
            setLoading(prev => ({...prev, questions: false}));
        }
    };

    const handleToggleQuestions = () => {
        if (!showQuestions && questions.length === 0) {
            fetchQuestions();
        }
        setShowQuestions(!showQuestions);
    };

    if (loading.test) return <TestState type="loading"/>;
    if (error.test || !testData) return <TestState type="error" message={error}/>;

    const {name, description, lastUse, progress, questionsCount} = testData;

    return (
        <>
            <HeaderTest
                name={name}
                id={id}
                disabledStart={questionsCount === 0}
            />
            <main className={`container ${styles.main}`}>
                <section className={styles.info}>
                    <h2>Описание теста</h2>
                    {description ? <p className={styles.description}>{description}</p> :
                        <p className={`${styles.description} ${styles.descriptionEmpty}`}>Здесь могло быть
                            описание...</p>}
                    <div className={styles.lastUse}>
                        Последнее прохождение: {lastUse}
                    </div>

                    <ProgressBar value={progress || 0} total={questionsCount || 0}/>
                </section>

                <div className={styles.toggle}>
                    <button
                        className={styles.toggleBtn}
                        onClick={handleToggleQuestions}
                        disabled={loading.questions}
                    >
                        {showQuestions ? "Скрыть вопросы" : "Показать вопросы"}
                    </button>
                </div>

                {showQuestions && (
                    <section className={styles.questions}>
                        <h2>Вопросы теста</h2>
                        {loading.questions ? (
                            <div className={styles.loadingState}>Загрузка вопросов...</div>
                        ) : error.questions ? (
                            <div className={styles.errorState}>
                                {error.questions}
                            </div>
                        ) : questions.length > 0? (
                            questions.map((question, index) => (
                                <QuestionBlock
                                    key={question.id}
                                    question={question}
                                    index={index}
                                />
                            ))
                        ) : (
                            <div className={styles.emptyState}>Вопросов пока нет</div>
                        )}
                    </section>
                )}
            </main>
        </>
    );
};

export default TestPage;
