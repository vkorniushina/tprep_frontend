import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import EyeOpenIcon from "../../assets/images/eye_open.svg?react";
import EyeClosedIcon from "../../assets/images/eye_closed.svg?react";
import EmailIcon from "../../assets/images/email.svg?react";
import LockIcon from "../../assets/images/lock.svg?react";
import { useLoginForm } from "../../hooks/useLoginForm";
import classNames from "classnames";
import FormInput from "../../components/FormInput/FormInput.jsx";

const Login = () => {
    const navigate = useNavigate();
    const form = useLoginForm();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.validateForm()) {
            return;
        }

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
                        <FormInput
                            type="email"
                            id="email"
                            value={form.email}
                            onChange={form.handleEmailChange}
                            onBlur={form.handleEmailBlur}
                            placeholder="E-mail"
                            icon={EmailIcon}
                            error={form.emailError}
                        />

                        <div className={styles.fieldGroup}>
                            <div className={styles.inputWrapper}>
                                <LockIcon className={styles.inputIcon} />
                                <input
                                    ref={form.passwordRef}
                                    type={form.showPassword ? "text" : "password"}
                                    id="password"
                                    value={form.password}
                                    onChange={form.handlePasswordChange}
                                    onBlur={form.handlePasswordBlur}
                                    placeholder="Пароль"
                                    className={classNames(
                                        styles.input,
                                        styles.inputWithEye,
                                        {[styles.inputError]: form.passwordError}
                                    )}
                                />
                                {form.password && (
                                    <button
                                        type="button"
                                        className={styles.eyeButton}
                                        onClick={form.togglePasswordVisibility}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        {form.showPassword ? (
                                            <EyeClosedIcon className={styles.eyeIcon} />
                                        ) : (
                                            <EyeOpenIcon className={styles.eyeIcon} />
                                        )}
                                    </button>
                                )}
                            </div>
                            {form.passwordError && (
                                <div className={styles.errorMessage}>{form.passwordError}</div>
                            )}
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

                    <button className={styles.secondaryButton} onClick={handleRegisterClick}>
                        Зарегистрироваться
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;
