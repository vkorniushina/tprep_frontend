import React from 'react';
import styles from './FooterQuiz.module.scss';

const FooterQuiz = ({
                        onPrevious,
                        onNext,
                        isPreviousDisabled,
                        showCheckButton,
                        onCheckAnswer,
                        isLastQuestion,
                        onFinishTest
                    }) => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.inner}`}>
                <button
                    className={`${styles.navButton} ${styles.prevButton} ${isPreviousDisabled ? styles.hidden : ''}`}
                    onClick={onPrevious}
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
                    className={`${styles.navButton} ${isLastQuestion ? styles.finishButton : styles.nextButton}`}
                    onClick={isLastQuestion ? onFinishTest : onNext}
                >
                    {isLastQuestion ? 'Завершить тест' : 'Следующий вопрос'}
                </button>
            </div>
        </footer>
    );
};

export default FooterQuiz;
