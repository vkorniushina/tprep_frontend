import React from "react";
import classNames from "classnames";
import styles from "./PasswordStrengthIndicator.module.scss";
import {PASSWORD_STRENGTH} from "../../constants/passwordStrength.js";

const PasswordStrengthIndicator = ({ strength, hint }) => {
    if (!hint) return null;

    return (
        <>
            <div className={styles.passwordStrengthBar}>
                <div
                    className={classNames(styles.passwordStrengthFill, {
                        [styles.weakFill]: strength === PASSWORD_STRENGTH.WEAK,
                        [styles.mediumFill]: strength === PASSWORD_STRENGTH.MEDIUM,
                        [styles.strongFill]: strength === PASSWORD_STRENGTH.STRONG
                    })}
                />
            </div>

            {strength === PASSWORD_STRENGTH.WEAK && (
                <div className={styles.errorMessage}>{hint}</div>
            )}

            {strength === PASSWORD_STRENGTH.MEDIUM && (
                <div className={styles.passwordMessage}>
                    <span>Простой пароль.</span>
                    <span className={styles.mediumPasswordHint}> {hint}</span>
                </div>
            )}

            {strength === PASSWORD_STRENGTH.STRONG && (
                <div className={styles.passwordMessage}>{hint}</div>
            )}
        </>
    );
};

export default PasswordStrengthIndicator;
