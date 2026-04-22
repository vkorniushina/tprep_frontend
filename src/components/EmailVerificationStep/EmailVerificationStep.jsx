import React, {useEffect} from "react";
import styles from "../EmailVerificationStep/EmailVerificationStep.module.scss";
import ArrowLeftIcon from "../../assets/images/arrow_left.svg?react";
import {useEmailVerification} from "../../hooks/useEmailVerification.js";

const EmailVerificationStep = ({email, isSubmitting, onSuccess, onBack}) => {
    const {
        code,
        secondsLeft,
        canResend,
        isLoading,
        error,
        needsNewCode,
        startTimer,
        stopTimer,
        handleCodeChange,
        handleResend,
        handleVerify,
    } = useEmailVerification(email);

    useEffect(() => {
        startTimer();
        return stopTimer;
    }, []);

    const handleSubmit = async () => {
        const verified = await handleVerify();
        if (verified) onSuccess();
    };

    return (
        <div className={styles.verification}>
            <button className={styles.backBtn} onClick={onBack} disabled={isSubmitting}>
                <ArrowLeftIcon/>
            </button>

            <h2 className={styles.title}>Подтверждение email</h2>

            <p className={styles.verifyDescription}>
                Отправили код подтверждения на почту
                <br/>
                <span className={styles.verifyEmail}>{email}</span>
            </p>

            <div className={styles.codeRow}>
                <input
                    type="text"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="Код"
                    className={styles.codeInput}
                    autoFocus
                    maxLength={6}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button
                    className={styles.codeSubmitBtn}
                    onClick={handleSubmit}
                    disabled={code.length !== 6 || needsNewCode || isLoading || isSubmitting}
                >
                    <ArrowLeftIcon className={styles.buttonIcon}/>
                </button>
            </div>

            {error && <p className={styles.verifyError}>{error}</p>}

            <div className={styles.resendBlock}>
                {(canResend || needsNewCode) ? (
                    <button className={styles.resendBtn} onClick={handleResend}>
                        Отправить повторно
                    </button>
                ) : (
                    <p className={styles.resendTimer}>
                        Отправить повторно через {secondsLeft} с.
                    </p>
                )}
            </div>
        </div>
    );
};

export default EmailVerificationStep;
