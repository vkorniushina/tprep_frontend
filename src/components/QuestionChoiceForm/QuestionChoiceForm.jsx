import React from 'react';
import styles from './QuestionChoiceForm.module.scss';
import CheckIcon from "../../assets/images/tick.svg?react";
import CrossIcon from "../../assets/images/cross.svg?react";
import ChoiceLabelContainer from "../ChoiceLabelContainer/ChoiceLabelContainer.jsx";
import classNames from "classnames";

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
            <ChoiceLabelContainer
                isChecked={isChecked}
                allCorrectSelected={allCorrectSelected}
                hasSelectedIncorrect={hasSelectedIncorrect}
                notAllCorrectSelected={notAllCorrectSelected}
                hasErrors={hasErrors}
            />

            <div className={styles.answers}>
                {answers.map((answer) => {
                    const isSelected = selected.includes(answer.id);
                    const isGloballyCorrect = correctAnswers.includes(answer.id);

                    const IconComponent =
                        isChecked && !answer.isCorrect && isSelected
                            ? CrossIcon
                            : CheckIcon;

                    return (
                        <div
                            key={answer.id}
                            className={classNames(
                                styles.option,
                                {
                                    [styles.selected]: isSelected,
                                    [styles.correct]: isChecked && isSelected && isGloballyCorrect,
                                    [styles.incorrect]: isChecked && isSelected && !isGloballyCorrect,
                                    [styles.missedCorrect]: isChecked && !isSelected && isGloballyCorrect,
                                }
                            )}
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
