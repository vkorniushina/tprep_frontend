import React from "react";
import styles from "./TestState.module.scss";
import arrowLeft from "../../assets/images/arrow_left.svg";
import {useNavigate, useParams} from "react-router-dom";

const TestState = ({ type, message }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isLoading = type === "loading";
    const headerTitle = isLoading ? "Загрузка..." : "Ошибка";
    const text = isLoading ? "Загрузка данных теста..." : (message || "Тест не найден");

    const handleBack = () => {
        sessionStorage.removeItem(`quizState_${id}`);
        navigate(`/test/${id}`);
    };

    return (
        <>
            <header className={styles.header}>
                <div className={`container ${styles.inner}`}>
                    <img
                        src={arrowLeft}
                        className={styles.backIcon}
                        onClick={handleBack}
                    />
                    <h1 className={styles.title}>{headerTitle}</h1>
                </div>
            </header>
            <div className={`container ${styles.main}`}>
                <div className={isLoading ? styles.loadingState : styles.errorState}>
                    {text}
                </div>
            </div>
        </>
    );
};

export default TestState;
