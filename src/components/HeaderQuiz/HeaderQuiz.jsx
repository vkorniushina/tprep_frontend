import React from 'react';
import styles from './HeaderQuiz.module.scss';
import CloseIcon from "../../assets/images/close.svg?react";

const HeaderQuiz = ({testName, currentQuestion, totalQuestions, onExitClick}) => {

    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.title}>
                    <h1>{testName}</h1>
                    <div className={styles.questionCounter}>
                        Вопрос {currentQuestion}/{totalQuestions}
                    </div>
                </div>

                <button className={styles.closeButton} onClick={onExitClick}>
                    <CloseIcon className={styles.closeIcon}/>
                </button>
            </div>
        </header>
    );
};

export default HeaderQuiz;
