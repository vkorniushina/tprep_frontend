import React from "react";
import classNames from "classnames";
import LockIcon from "../../assets/images/lock.svg?react";
import EyeOpenIcon from "../../assets/images/eye_open.svg?react";
import EyeClosedIcon from "../../assets/images/eye_closed.svg?react";
import styles from "./PasswordInput.module.scss";

const PasswordInput = ({
                           id,
                           value,
                           onChange,
                           onBlur,
                           placeholder,
                           showPassword,
                           onToggleVisibility,
                           passwordRef,
                           error,
                           hasError
                       }) => {
    return (
        <div>
            <div className={styles.inputWrapper}>
                <LockIcon className={styles.inputIcon} />
                <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    id={id}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={classNames(
                        styles.input,
                        styles.inputWithEye,
                        { [styles.inputError]: hasError }
                    )}
                />
                {value && (
                    <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={onToggleVisibility}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {showPassword ? (
                            <EyeClosedIcon className={styles.eyeIcon} />
                        ) : (
                            <EyeOpenIcon className={styles.eyeIcon} />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <div className={styles.errorMessage}>{error}</div>
            )}
        </div>
    );
};

export default PasswordInput;
