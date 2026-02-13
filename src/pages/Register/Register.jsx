import React, { useState } from "react";
import styles from "./Register.module.scss";
import CheckIcon from "../../assets/images/tick.svg?react";
import UserIcon from "../../assets/images/user.svg?react";
import EmailIcon from "../../assets/images/email.svg?react";
import LockIcon from "../../assets/images/lock.svg?react";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
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
                        <div className={styles.fieldGroup}>
                            <div className={styles.inputWrapper}>
                                <UserIcon className={styles.inputIcon} />
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Имя"
                                    className={styles.input}
                                />
                            </div>
                        </div>

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
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Пароль"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.fieldGroup}>
                            <div className={styles.inputWrapper}>
                                <LockIcon className={styles.inputIcon} />
                                <input
                                    type="password"
                                    id="passwordConfirm"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    placeholder="Повторите пароль"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <label className={styles.checkboxLabel}>
                            <div className={styles.checkboxWrapper}>
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className={styles.checkboxInput}
                                />
                                {termsAccepted && (
                                    <CheckIcon className={styles.checkboxIcon} />
                                )}
                            </div>
                            <span className={styles.checkboxText}>
                                Я принимаю условия использования и политику конфиденциальности
                            </span>
                        </label>

                        <button type="submit" className={styles.primaryButton}>
                            Зарегистрироваться
                        </button>
                    </form>

                    <div className={styles.divider}>
                        <span>Уже есть аккаунт?</span>
                    </div>

                    <button className={styles.secondaryButton}>
                        Войти
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Register;
