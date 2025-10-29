import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import HeaderTest from "../../components/HeaderTest/HeaderTest";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import styles from "./TestPage.module.scss";
import { getModuleById } from "../../api/modules.js";
import QuestionBlock from "../../components/QuestionBlock/QuestionBlock.jsx";

const TestPage = () => {
    const [showQuestions, setShowQuestions] = useState(false);
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                setLoading(true);
                const data = await getModuleById(Number(id));
                setTestData(data);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить информацию о тесте');
                console.error('Error fetching test data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTestData();
        }
    }, [id]);

    if (loading) {
        return (
            <>
                <HeaderTest name="Загрузка..." />
                <div className={`container ${styles.main}`}>
                    <div className={styles.loadingState}>Загрузка данных теста...</div>
                </div>
            </>
        );
    }

    
    if (error || !testData) {
        return (
            <>
                <HeaderTest name="Ошибка" />
                <div className={`container ${styles.main}`}>
                    <div className={styles.errorState}>
                        {error || 'Тест не найден'}
                    </div>
                </div>
            </>
        );
    }

    const { name, description, lastUse, progress, questions } = testData;

    return (
        <>
            <HeaderTest name={name}/>
            <main className={`container ${styles.main}`}>
                <section className={styles.info}>
                    <h2>Описание теста</h2>
                    {description ? <p className={styles.description}>{description}</p> :
                        <p className={styles.description} style={{color: '#a6a6a6'}}>Здесь могло быть описание...</p>}

                    <div className={styles.lastUse}>
                        Последнее прохождение: {lastUse}
                    </div>

                    <ProgressBar value={progress || 0} total={questions ? questions.length : 0} />
                </section>

                <div className={styles.toggle}>
                    <button
                        className={styles.toggleBtn}
                        onClick={() => setShowQuestions(!showQuestions)}
                    >
                        {showQuestions ? "Скрыть вопросы" : "Показать вопросы"}
                    </button>
                </div>

                {showQuestions && (
                    <section className={styles.questions}>
                        <h2>Вопросы теста</h2>
                        {questions.map((question, index) => (
                            <QuestionBlock
                                key={index}
                                question={question}
                                index={index}
                            />
                        ))}
                    </section>
                )}
            </main>
        </>
    );
};

export default TestPage;
