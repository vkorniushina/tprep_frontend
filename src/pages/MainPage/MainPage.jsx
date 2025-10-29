import React, {useEffect, useState} from "react";
import HeaderMain from "../../components/HeaderMain/HeaderMain.jsx";
import plusIcon from "../../assets/images/plus.svg";
import styles from "../MainPage/MainPage.module.scss";
import Card from "../../components/Card/Card.jsx";
import {getAllModules} from "../../api/modules.js";

const MainPage = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTests = async () => {
            try {
                setLoading(true);
                const data = await getAllModules();
                setTests(data);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить тесты');
                console.error('Error fetching tests:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, []);


    const filteredTests = searchQuery.trim()
        ? tests.filter(test => test.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : tests;

    return (
        <>
            <HeaderMain searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            <main className={`container ${styles.main}`}>
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>Мои тесты</h1>
                    <button className={styles.createBtn}>
                        <img src={plusIcon} alt="Plus"/>
                        Создать тест
                    </button>
                </div>

                {loading && <div className={styles.loadingEmptyState}>Загрузка тестов...</div>}
                {error && <div className={styles.loadingEmptyState}>{error}</div>}

                {!loading && !error && (
                    filteredTests.length > 0 ? (
                        <div className={styles.cards}>
                            {filteredTests.map((test) => (
                                <Card
                                    key={test.id}
                                    id={test.id}
                                    name={test.name}
                                    description={test.description}
                                    questionsCount={test.questionsCount}
                                    progress={test.progress}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyMessage}>
                                {searchQuery.trim()
                                    ? "По вашему запросу ничего не найдено"
                                    : "У вас пока нет тестов"}
                            </p>
                            <p className={styles.emptySubMessage}>
                                {searchQuery.trim()
                                    ? "Попробуйте изменить поисковый запрос"
                                    : "Создайте первый тест, чтобы начать обучение"}
                            </p>
                        </div>
                    )
                )}
            </main>
        </>
    )
}

export default MainPage;