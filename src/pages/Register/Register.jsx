import React, {useRef, useState} from "react";
import styles from "./Register.module.scss";
import CheckIcon from "../../assets/images/tick.svg?react";
import UserIcon from "../../assets/images/user.svg?react";
import EmailIcon from "../../assets/images/email.svg?react";
import LockIcon from "../../assets/images/lock.svg?react";
import EyeOpenIcon from "../../assets/images/eye_open.svg?react";
import EyeClosedIcon from "../../assets/images/eye_closed.svg?react";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(true);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const passwordRef = useRef(null);
    const passwordConfirmRef = useRef(null);

    const togglePasswordVisibility = (field) => {
        const ref = field === 'password' ? passwordRef : passwordConfirmRef;
        const cursorPosition = ref.current?.selectionStart;

        if (field === 'password') {
            setShowPassword(prev => !prev);
        } else {
            setShowPasswordConfirm(prev => !prev);
        }

        requestAnimationFrame(() => {
            if (ref.current && document.activeElement === ref.current) {
                ref.current.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    };

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
                                        onClick={() => togglePasswordVisibility('password')}
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

                        <div className={styles.fieldGroup}>
                            <div className={styles.inputWrapper}>
                                <LockIcon className={styles.inputIcon} />
                                <input
                                    ref={passwordConfirmRef}
                                    type={showPasswordConfirm ? "text" : "password"}
                                    id="passwordConfirm"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    placeholder="Повторите пароль"
                                    className={`${styles.input} ${styles.inputWithEye}`}
                                />
                                {passwordConfirm && (
                                    <button
                                        type="button"
                                        className={styles.eyeButton}
                                        onClick={() => togglePasswordVisibility('passwordConfirm')}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        {showPasswordConfirm ? (
                                            <EyeClosedIcon className={styles.eyeIcon} />
                                        ) : (
                                            <EyeOpenIcon className={styles.eyeIcon} />
                                        )}
                                    </button>
                                )}
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
