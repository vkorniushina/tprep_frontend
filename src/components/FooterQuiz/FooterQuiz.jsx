import React from 'react';
import classNames from 'classnames';
import ArrowIcon from "../../assets/images/arrow_right.svg?react";
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
                    <ArrowIcon className={`${styles.arrowIcon} ${styles.arrowLeft}`}/>
                    <span className={styles.btnText}>Предыдущий вопрос</span>
                </button>

                {showCheckButton && (
                    <button
                        className={`${styles.navButton} ${styles.checkButton}`}
                        onClick={onCheckAnswer}
                    >
                        <span>Проверить</span>
                        <span className={styles.extraText}>ответ</span>
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
                    {isLastQuestion ? (
                        <>
                            <span>Завершить</span>
                            <span className={styles.extraText}>тест</span>
                        </>
                    ) : (
                        <>
                            <span className={styles.btnText}>Следующий вопрос</span>
                            <ArrowIcon className={styles.arrowIcon}/>
                        </>
                    )}
                </button>
            </div>
        </footer>
    );
};

export default FooterQuiz;
