import React from "react";
import classNames from "classnames";
import styles from "./PasswordStrengthIndicator.module.scss";

const PasswordStrengthIndicator = ({ strength, hint }) => {
    if (!hint) return null;

    return (
        <>
            <div className={styles.passwordStrengthBar}>
                <div
                    className={classNames(styles.passwordStrengthFill, {
                        [styles.weakFill]: strength === 'weak',
                        [styles.mediumFill]: strength === 'medium',
                        [styles.strongFill]: strength === 'strong'
                    })}
                />
            </div>

            {strength === 'weak' && (
                <div className={styles.errorMessage}>{hint}</div>
            )}

            {strength === 'medium' && (
                <div className={styles.passwordMessage}>
                    <span>Простой пароль.</span>
                    <span className={styles.mediumPasswordHint}> {hint}</span>
                </div>
            )}

            {strength === 'strong' && (
                <div className={styles.passwordMessage}>{hint}</div>
            )}
        </>
    );
};

export default PasswordStrengthIndicator;
