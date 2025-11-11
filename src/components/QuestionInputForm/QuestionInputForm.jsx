import React from 'react';
import styles from './QuestionInputForm.module.scss';
import correctIcon from "../../assets/images/correct.svg";
import incorrectIcon from "../../assets/images/incorrect.svg";

const QuestionInputForm = ({value, onChange, disabled, isChecked, isCorrect, correctAnswer}) => {
    return (
        <div className={styles.inputForm}>
            <div className={styles.labelContainer}>
                {!isChecked && (
                    <div className={styles.label}>Ваш ответ</div>
                )}

                {isChecked && isCorrect && (
                    <div className={styles.correctLabel}>
                        <img src={correctIcon} alt="Верно" className={styles.statusIcon}/>
                        <span>Да, это верно!</span>
                    </div>
                )}

                {isChecked && !isCorrect && (
                    <div className={styles.incorrectLabel}>
                        <img src={incorrectIcon} alt="Неверно" className={styles.statusIcon}/>
                        <span>Ошибки случаются!</span>
                    </div>
                )}
            </div>

            <textarea
                className={`${styles.input} ${isChecked ? (isCorrect ? styles.correct : styles.incorrect) : ''}`}
                placeholder="Введите ответ"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />

            {isChecked && !isCorrect && correctAnswer && (
                <div className={styles.correctAnswerSection}>
                    <div className={styles.correctAnswerLabel}>Правильный ответ</div>
                    <div className={styles.correctAnswerBox}>
                        {correctAnswer}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionInputForm;