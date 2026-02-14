import React, {useEffect, useRef, useState} from "react";
import styles from "./EmailVerification.module.scss";
import ArrowLeftIcon from "../../assets/images/arrow_left.svg?react";
import {useLocation, useNavigate} from "react-router-dom";

const EmailVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [verificationCode, setVerificationCode] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const timerRef = useRef(null);

    const email = location.state?.email || "ivanov.mail@gmail.com";

    useEffect(() => {
        startTimer();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const startTimer = () => {
        setSecondsLeft(60);
        setCanResend(false);

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendCode = () => {
        startTimer();
        setVerificationCode("");
    };

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setVerificationCode(value);
    };

    const handleCodeSubmit = (e) => {
        e.preventDefault();
        if (!verificationCode || verificationCode.length !== 4) return;

        navigate("/");
    };

    const handleGoBack = () => {
        navigate("/register");
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>T-Prep</h1>
            </header>

            <main className={styles.main}>
                <div className={styles.card}>
                    <button
                        className={styles.backButton}
                        onClick={handleGoBack}
                    >
                        <ArrowLeftIcon/>
                    </button>

                    <h2 className={styles.title}>Введите код</h2>

                    <p className={styles.description}>
                        Отправили код подтверждения на почту
                        <br/>
                        <span className={styles.email}>{email}</span>
                    </p>

                    <div className={styles.formContainer}>
                        <form onSubmit={handleCodeSubmit} className={styles.formGroup}>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={handleCodeChange}
                                placeholder="Код"
                                className={styles.input}
                                autoFocus
                                maxLength={4}
                            />
                            <button
                                type="submit"
                                className={styles.primaryButton}
                                disabled={verificationCode.length !== 4}
                            >
                                <ArrowLeftIcon className={styles.buttonIcon}/>
                            </button>
                        </form>
                    </div>


                    <div className={styles.resendBlock}>
                        {canResend ? (
                            <button
                                className={styles.resendButton}
                                onClick={handleResendCode}
                            >
                                Отправить повторно
                            </button>
                        ) : (
                            <p className={styles.timerText}>
                                Отправить повторно через {secondsLeft} с.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EmailVerification;
