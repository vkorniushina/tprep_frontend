import React from "react";
import classNames from "classnames";
import styles from "./FormInput.module.scss";

const FormInput = ({
                       type,
                       id,
                       value,
                       onChange,
                       onBlur,
                       placeholder,
                       icon: Icon,
                       error,
                       className
                   }) => {
    return (
        <div className={styles.fieldGroup}>
            <div className={styles.inputWrapper}>
                {Icon && <Icon className={styles.inputIcon} />}
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={classNames(
                        styles.input,
                        {[styles.inputError]: error},
                        className
                    )}
                />
            </div>
            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}
        </div>
    );
};

export default FormInput;
