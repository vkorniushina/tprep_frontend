import React, {useState} from "react";
import Header from "../../components/Header/Header.jsx";
import plusIcon from "../../assets/images/plus.svg";
import styles from "../MainPage/MainPage.module.scss";
import Card from "../../components/Card/Card.jsx";
import {tests} from "../../mocks/tests.js";

const MainPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTests = searchQuery.trim()
        ? tests.filter(test => test.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : tests;

    return (
        <>
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
            <main className={`container ${styles.main}`}>
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>Мои тесты</h1>
                    <button className={styles.createBtn}>
                        <img src={plusIcon} alt="Plus"/>
                        Создать тест
                    </button>
                </div>

                {filteredTests.length > 0 ? (
                    <div className={styles.cards}>
                        {filteredTests.map((test) => (
                            <Card
                                key={test.id}
                                title={test.title}
                                description={test.description}
                                questions={test.questions}
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
                )}
            </main>
        </>
    )
}

export default MainPage;