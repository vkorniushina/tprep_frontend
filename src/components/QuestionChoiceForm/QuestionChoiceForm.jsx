import React from 'react';
import styles from './QuestionChoiceForm.module.scss';
import CheckIcon from "../../assets/images/tick.svg?react";
import CrossIcon from "../../assets/images/cross.svg?react";
import correctIcon from "../../assets/images/correct.svg";
import incorrectIcon from "../../assets/images/incorrect.svg";

const QuestionChoiceForm = ({answers, selected, onSelect, disabled, isChecked, correctAnswers = []}) => {

    const handleSelect = (answerId) => {
        if (disabled) return;
        const newSelected = [...selected];

        if (newSelected.includes(answerId)) {
            onSelect(newSelected.filter(id => id !== answerId));
        } else {
            onSelect([...newSelected, answerId]);
        }
    };

    const hasSelectedIncorrect =
        isChecked &&
        selected.some(id => !correctAnswers.includes(id));

    const allCorrectSelected =
        isChecked &&
        correctAnswers.every(id => selected.includes(id)) &&
        selected.length === correctAnswers.length;

    const notAllCorrectSelected =
        isChecked &&
        correctAnswers.some(id => !selected.includes(id));

    const hasErrors = isChecked && (hasSelectedIncorrect || notAllCorrectSelected);

    return (
        <div>
            <div className={styles.labelContainer}>
                {isChecked && allCorrectSelected && (
                    <div className={styles.correctLabel}>
                        <img src={correctIcon} alt="Верно"/>
                        <span>Да, это верно!</span>
                    </div>
                )}

                {isChecked && hasSelectedIncorrect && (
                    <div className={styles.incorrectLabel}>
                        <img src={incorrectIcon} alt="Неверно"/>
                        <span>Ошибки случаются!</span>
                    </div>
                )}

                {isChecked && !hasSelectedIncorrect && notAllCorrectSelected && (
                    <div className={styles.incorrectLabel}>
                        <img src={incorrectIcon} alt="Неполно"/>
                        <span>Выбраны не все правильные варианты!</span>
                    </div>
                )}

                {(!isChecked || (!allCorrectSelected && !hasErrors)) && (
                    <div className={styles.label}>Выберите один или несколько вариантов:</div>
                )}
            </div>

            <div className={styles.answers}>
                {answers.map((answer) => {
                    const isSelected = selected.includes(answer.id);
                    const isGloballyCorrect = correctAnswers.includes(answer.id);
                    let optionClasses = [styles.option];

                    if (isChecked) {
                        if (isSelected) {
                            optionClasses.push(styles.selected);
                            optionClasses.push(isGloballyCorrect ? styles.correct : styles.incorrect);
                        }
                        else if (isGloballyCorrect) {
                            optionClasses.push(styles.missedCorrect);
                        }
                    } else if (isSelected) {
                        optionClasses.push(styles.selected);
                    }

                    const IconComponent =
                        isChecked && !answer.isCorrect && isSelected
                            ? CrossIcon
                            : CheckIcon;

                    return (
                        <div
                            key={answer.id}
                            className={optionClasses.join(' ')}
                            onClick={() => handleSelect(answer.id)}
                        >
                            <div className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {}}
                                    disabled={disabled}
                                />
                                <span className={styles.checkmark}>
                                    <IconComponent className={styles.checkSvg}/>
                                </span>
                            </div>

                            <div className={styles.optionText}>
                                {answer.content}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionChoiceForm;
