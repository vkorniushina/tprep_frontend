import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./Login.module.scss";
import EyeOpenIcon from "../../assets/images/eye_open.svg?react";
import EyeClosedIcon from "../../assets/images/eye_closed.svg?react";
import EmailIcon from "../../assets/images/email.svg?react";
import LockIcon from "../../assets/images/lock.svg?react";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const passwordRef = useRef(null);

    const togglePasswordVisibility= () => {
        const ref =  passwordRef;
        const cursorPosition = ref.current?.selectionStart;
        setShowPassword(prev => !prev);

        requestAnimationFrame(() => {
            if (ref.current && document.activeElement === ref.current) {
                ref.current.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/");
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>T-Prep</h1>
            </header>

            <main className={styles.main}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Вход в аккаунт</h2>

                    <form onSubmit={handleSubmit} className={styles.form} noValidate>

                        <div className={styles.fieldGroup}>
                            <div className={styles.inputWrapper}>
                                <EmailIcon className={styles.inputIcon} />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="E-mail"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.fieldGroup}>
                            <div className={styles.inputWrapper}>
                                <LockIcon className={styles.inputIcon} />
                                <input
                                    ref={passwordRef}
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Пароль"
                                    className={`${styles.input} ${styles.inputWithEye}`}
                                />
                                {password && (
                                    <button
                                        type="button"
                                        className={styles.eyeButton}
                                        onClick={togglePasswordVisibility}
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
                        </div>

                        <div className={styles.forgotPassword}>
                            <span>Забыли пароль?</span>
                        </div>

                        <button type="submit" className={styles.primaryButton}>
                            Войти
                        </button>
                    </form>

                    <div className={styles.divider}>
                        <span>Нет аккаунта?</span>
                    </div>

                    <button className={styles.secondaryButton}
                            onClick={handleRegisterClick}
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;
