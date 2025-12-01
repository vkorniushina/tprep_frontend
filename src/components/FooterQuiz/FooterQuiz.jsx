import React from 'react';
import classNames from 'classnames';
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
                    className={classNames(
                        styles.navButton,
                        styles.prevButton,
                        {[styles.hidden]: isPreviousDisabled})
                    }
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
                    className={classNames(
                        styles.navButton, {
                            [styles.finishButton]: isLastQuestion,
                            [styles.nextButton]: !isLastQuestion
                        }
                    )}
                    onClick={isLastQuestion ? onFinishTest : onNext}
                >
                    {isLastQuestion ? 'Завершить тест' : 'Следующий вопрос'}
                </button>
            </div>
        </footer>
    );
};

export default FooterQuiz;
