import React from 'react';
import styles from './QuestionChoiceForm.module.scss';
import CheckIcon from "../../assets/images/tick.svg?react";
import CrossIcon from "../../assets/images/cross.svg?react";
import correctIcon from "../../assets/images/correct.svg";
import incorrectIcon from "../../assets/images/incorrect.svg";

const QuestionChoiceForm = ({answers, selected, onSelect, disabled, isChecked, correctAnswers = []}) => {

    const handleSelect = (index) => {
        if (disabled) return;
        const newSelected = [...selected];
        const position = newSelected.indexOf(index);

        if (position !== -1) {
            newSelected.splice(position, 1);
        } else {
            newSelected.push(index);
        }
        onSelect(newSelected);
    };

    const hasSelectedIncorrect = isChecked && selected.some(index => !answers[index].isCorrect);

    const allCorrectSelected = isChecked &&
        correctAnswers.every(index => selected.includes(index)) &&
        selected.length === correctAnswers.length;

    const notAllCorrectSelected = isChecked &&
        correctAnswers.some(index => !selected.includes(index));

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
                {answers.map((answer, index) => {
                    let optionClasses = [styles.option];
                    if (isChecked) {
                        if (selected.includes(index)) {
                            optionClasses.push(styles.selected);
                            if (answer.isCorrect) {
                                optionClasses.push(styles.correct);
                            }
                            else {
                                optionClasses.push(styles.incorrect);
                            }
                        }
                        else if (answer.isCorrect) {
                            optionClasses.push(styles.missedCorrect);
                        }
                    }
                    else if (selected.includes(index)) {
                        optionClasses.push(styles.selected);
                    }

                    const IconComponent =
                        isChecked && !answer.isCorrect && selected.includes(index)
                            ? CrossIcon
                            : CheckIcon;

                    return (
                        <div
                            key={index}
                            className={optionClasses.join(' ')}
                            onClick={() => handleSelect(index)}
                        >
                            <div className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(index)}
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
