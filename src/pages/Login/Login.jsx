import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import EmailIcon from "../../assets/images/email.svg?react";
import { useLoginForm } from "../../hooks/useLoginForm";
import FormInput from "../../components/FormInput/FormInput.jsx";
import PasswordInput from "../../components/PasswordInput/PasswordInput.jsx";
import { signIn } from "../../api/auth.js";
import { saveToken } from "../../utils/tokenStorage.js";

const Login = () => {
    const navigate = useNavigate();
    const form = useLoginForm();

    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setServerError("");

        if (!form.validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await signIn(form.email, form.password);
            saveToken(response.token);
            navigate("/");
        } catch (error) {
            if (error.response?.status === 401) {
                setServerError("Неверный email или пароль");
            } else if (error.response?.status === 500) {
                setServerError("Ошибка сервера. Попробуйте позже");
            } else {
                setServerError("Ошибка входа. Проверьте соединение");
            }
        } finally {
            setIsLoading(false);
        }
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
                            <PasswordInput
                                id="password"
                                value={form.password}
                                onChange={form.handlePasswordChange}
                                placeholder="Пароль"
                                showPassword={form.showPassword}
                                onToggleVisibility={form.togglePasswordVisibility}
                                passwordRef={form.passwordRef}
                                error={form.passwordError}
                                hasError={form.passwordError}
                            />
                        </div>

                        <div className={styles.forgotPassword}>
                            <span>Забыли пароль?</span>
                        </div>


                        {serverError && (
                            <div className={styles.serverError}>{serverError}</div>
                        )}

                        <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={isLoading}
                        >
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
