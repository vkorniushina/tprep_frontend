import React from 'react';
import styles from './ChoiceLabelContainer.module.scss';
import correctIcon from "../../assets/images/correct.svg";
import incorrectIcon from "../../assets/images/incorrect.svg";

const ChoiceLabelContainer = ({ isChecked, allCorrectSelected, hasSelectedIncorrect, notAllCorrectSelected, hasErrors }) => {
    return (
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
                <div className={styles.label}>
                    Выберите один или несколько вариантов:
                </div>
            )}
        </div>
    );
};

export default ChoiceLabelContainer;
