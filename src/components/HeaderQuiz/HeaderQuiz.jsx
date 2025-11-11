import React, { useState } from 'react';
import styles from './HeaderQuiz.module.scss';
import CloseIcon from "../../assets/images/close.svg?react";

const HeaderQuiz = ({ testName, currentQuestion, totalQuestions, onConfirmClose }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleCloseClick = () => {
        setShowConfirm(true);
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        onConfirmClose();
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.title}>
                    <h1>{testName}</h1>
                    <div className={styles.questionCounter}>
                        Вопрос {currentQuestion}/{totalQuestions}
                    </div>
                </div>

                <button className={styles.closeButton} onClick={handleCloseClick}>
                    <CloseIcon className={styles.closeIcon} />
                </button>
            </div>

            {showConfirm && (
                <div className={styles.confirmOverlay}>
                    <div className={styles.confirmBox}>
                        <button className={styles.closeModalButton} onClick={handleCancel}>
                            <CloseIcon className={styles.closeIcon} />
                        </button>
                        <h2>Вы точно хотите выйти?</h2>
                        <p>Прогресс будет утерян</p>
                        <div className={styles.buttons}>
                            <button className={styles.cancelButton} onClick={handleCancel}>
                                Остаться
                            </button>
                            <button className={styles.confirmButton} onClick={handleConfirm}>
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default HeaderQuiz;
