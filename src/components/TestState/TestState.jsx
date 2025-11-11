import React from "react";
import HeaderTest from "../HeaderTest/HeaderTest";
import styles from "./TestState.module.scss";

const TestState = ({ type, message }) => {
    const isLoading = type === "loading";
    const headerTitle = isLoading ? "Загрузка..." : "Ошибка";
    const text = isLoading ? "Загрузка данных теста..." : (message || "Тест не найден");

    return (
        <>
            <HeaderTest name={headerTitle} />
            <div className={`container ${styles.main}`}>
                <div className={isLoading ? styles.loadingState : styles.errorState}>
                    {text}
                </div>
            </div>
        </>
    );
};

export default TestState;
