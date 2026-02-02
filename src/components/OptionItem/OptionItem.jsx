import React from "react";
import styles from "./OptionItem.module.scss";
import tick from "../../assets/images/tick.svg";
import Cross from "../../assets/images/cross.svg?react";
import classNames from "classnames";

const OptionItem = ({option, onContentChange, onToggleCorrect, onRemove, error}) => {
    return (
        <div className={styles.optionItem}>
            <div className={styles.optionContentWrapper}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        className={styles.checkboxInput}
                        checked={option.isCorrect}
                        onChange={onToggleCorrect}
                    />
                    <span className={styles.checkboxSquare}>
                        {option.isCorrect && (
                            <img src={tick} alt="Выбрано" className={styles.checkboxTick}/>
                        )}
                    </span>
                </label>

                <input
                    className={classNames(
                        styles.optionInput,
                        error && styles.inputError
                    )}
                    value={option.content}
                    onChange={(e) => onContentChange(e.target.value)}
                />

                <button className={styles.optionRemove} onClick={onRemove}>
                    <Cross className={styles.cross}/>
                </button>
            </div>
            {error && (
                <div className={styles.errorMessageFlow}>{error}</div>
            )}
        </div>
    );
};

export default OptionItem;
