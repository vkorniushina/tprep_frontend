import React from 'react';
import styles from './FooterQuiz.module.scss';

const FooterQuiz = ({
                        onPrevious,
                        onNext,
                        isPreviousDisabled,
                        isNextDisabled,
                        showCheckButton,
                        onCheckAnswer
                    }) => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.inner}`}>
                <button
                    className={`${styles.navButton} ${styles.prevButton}`}
                    onClick={onPrevious}
                    disabled={isPreviousDisabled}
                >
                    Предыдущий вопрос
                </button>

                {showCheckButton && (
                    <button
                        className={`${styles.navButton} ${styles.checkButton}`}
                        onClick={onCheckAnswer}
                    >
                        Проверить ответ
                    </button>
                )}

                <button
                    className={`${styles.navButton} ${styles.nextButton}`}
                    onClick={onNext}
                    disabled={isNextDisabled}
                >
                    Следующий вопрос
                </button>
            </div>
        </footer>
    );
};

export default FooterQuiz;
