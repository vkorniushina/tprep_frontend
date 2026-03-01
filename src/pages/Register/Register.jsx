import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./Register.module.scss";
import CheckIcon from "../../assets/images/tick.svg?react";
import UserIcon from "../../assets/images/user.svg?react";
import EmailIcon from "../../assets/images/email.svg?react";
import {useRegisterForm} from "../../hooks/useRegisterForm.js";
import classNames from "classnames";
import FormInput from "../../components/FormInput/FormInput.jsx";
import PasswordInput from "../../components/PasswordInput/PasswordInput.jsx";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator/PasswordStrengthIndicator.jsx";
import {sendVerificationCode} from "../../api/auth.js";

const Register = () => {
    const navigate = useNavigate();
    const form = useRegisterForm();

    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.validateForm()) {
            return;
        }

        setIsLoading(true);
        setServerError("");

        try {
            await sendVerificationCode(form.email);
            navigate("/verify-email", {
                state: {
                    email: form.email,
                    password: form.password,
                    name: form.name,
                }
            });
        } catch (error) {
            if (error.response?.status === 500) {
                setServerError("Ошибка сервера. Попробуйте позже");
            } else {
                setServerError("Ошибка регистрации. Проверьте соединение");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>T-Prep</h1>
            </header>

            <main className={styles.main}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Создайте аккаунт</h2>

                    <form onSubmit={handleSubmit} className={styles.form} noValidate>
                        <FormInput
                            type="text"
                            id="name"
                            value={form.name}
                            onChange={form.handleNameChange}
                            onBlur={form.handleNameBlur}
                            placeholder="Имя"
                            icon={UserIcon}
                            error={form.nameError}
                        />

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
                                onToggleVisibility={() => form.togglePasswordVisibility('password')}
                                passwordRef={form.passwordRef}
                                error={form.passwordError}
                                hasError={form.passwordStrength === 'weak' || form.passwordError}
                            />

                            {form.password && !form.passwordError && (
                                <PasswordStrengthIndicator
                                    strength={form.passwordStrength}
                                    hint={form.passwordHint}
                                />
                            )}
                        </div>

                        <div className={styles.fieldGroup}>
                            <PasswordInput
                                id="passwordConfirm"
                                value={form.passwordConfirm}
                                onChange={form.handlePasswordConfirmChange}
                                onBlur={form.handlePasswordConfirmBlur}
                                placeholder="Повторите пароль"
                                showPassword={form.showPasswordConfirm}
                                onToggleVisibility={() => form.togglePasswordVisibility('passwordConfirm')}
                                passwordRef={form.passwordConfirmRef}
                                error={form.passwordConfirmError}
                                hasError={form.passwordConfirmError}
                            />
                        </div>

                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <div className={styles.checkboxWrapper}>
                                    <input
                                        type="checkbox"
                                        checked={form.termsAccepted}
                                        onChange={form.handleTermsChange}
                                        className={classNames(
                                            styles.checkboxInput,
                                            {[styles.checkboxError]: form.termsError}
                                        )}
                                    />
                                    {form.termsAccepted && (
                                        <CheckIcon className={styles.checkboxIcon}/>
                                    )}
                                </div>
                                <span className={styles.checkboxText}>
                                    Я принимаю условия использования и политику конфиденциальности
                                </span>
                            </label>
                            {form.termsError && (
                                <div className={styles.errorMessage}>{form.termsError}</div>
                            )}
                        </div>

                        {serverError && (
                            <div className={styles.serverError}>{serverError}</div>
                        )}

                        <button
                            type="submit"
                            className={styles.primaryButton}
                            disabled={isLoading}
                        >
                            Зарегистрироваться
                        </button>
                    </form>

                    <div className={styles.divider}>
                        <span>Уже есть аккаунт?</span>
                    </div>

                    <button className={styles.secondaryButton} onClick={handleLoginClick}>
                        Войти
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Register;
