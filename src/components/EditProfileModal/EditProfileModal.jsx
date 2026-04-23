import React, {useEffect} from "react";
import styles from "./EditProfileModal.module.scss";
import FormInput from "../FormInput/FormInput.jsx";
import PasswordInput from "../PasswordInput/PasswordInput.jsx";
import PasswordStrengthIndicator from "../PasswordStrengthIndicator/PasswordStrengthIndicator.jsx";
import CloseIcon from "../../assets/images/close.svg?react";
import UserIcon from "../../assets/images/user.svg?react";
import EmailIcon from "../../assets/images/email.svg?react";
import {useEditProfileForm} from "../../hooks/useEditProfileForm.js";
import {PASSWORD_STRENGTH} from "../../constants/passwordStrength.js";
import EmailVerificationStep from "../EmailVerificationStep/EmailVerificationStep.jsx";
import {EDIT_STEPS} from "../../constants/profileConstants.js";

const EditProfileModal = ({user, onClose, onSaved}) => {
    const {
        name,
        email,
        passwords,
        step,
        show,
        isDirty,
        isSubmitting,
        passwordStrength,
        passwordHint,
        errors,
        submitError,
        currentPasswordRef,
        newPasswordRef,
        repeatPasswordRef,
        handleNameChange,
        handleEmailChange,
        handleCurrentPasswordChange,
        handleNewPasswordChange,
        handleRepeatPasswordChange,
        handleNameBlur,
        handleEmailBlur,
        handleRepeatPasswordBlur,
        toggleVisibility,
        handleSubmit,
        handleVerificationSuccess,
        handleBackToForm,
    } = useEditProfileForm(user);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const onSaveSuccess = () => {
        onSaved?.({username: name, email});
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {step === EDIT_STEPS.FORM && (
                    <>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <CloseIcon className={styles.closeIcon}/>
                        </button>

                        <h2 className={styles.title}>Редактировать профиль</h2>

                        <FormInput
                            type="text"
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            onBlur={handleNameBlur}
                            placeholder="Имя"
                            icon={UserIcon}
                            error={errors.name}
                        />

                        <FormInput
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            placeholder="E-mail"
                            icon={EmailIcon}
                            error={errors.email}
                        />

                        <p className={styles.passwordLabel}>Сменить пароль</p>

                        <div className={styles.passwordBlock}>
                            <PasswordInput
                                value={passwords.current}
                                onChange={handleCurrentPasswordChange}
                                placeholder="Текущий пароль"
                                showPassword={show.current}
                                onToggleVisibility={() => toggleVisibility("current")}
                                passwordRef={currentPasswordRef}
                                error={errors.current}
                                hasError={!!errors.current}
                            />

                            <div className={styles.fieldGroup}>
                                <PasswordInput
                                    value={passwords.new}
                                    onChange={handleNewPasswordChange}
                                    placeholder="Новый пароль"
                                    showPassword={show.new}
                                    onToggleVisibility={() => toggleVisibility("new")}
                                    passwordRef={newPasswordRef}
                                    error={errors.new}
                                    hasError={!!errors.new || passwordStrength === PASSWORD_STRENGTH.WEAK}
                                />
                                <PasswordStrengthIndicator
                                    strength={passwordStrength}
                                    hint={passwordHint}
                                />
                            </div>

                            <PasswordInput
                                value={passwords.repeat}
                                onChange={handleRepeatPasswordChange}
                                onBlur={handleRepeatPasswordBlur}
                                placeholder="Повторите новый пароль"
                                showPassword={show.repeat}
                                onToggleVisibility={() => toggleVisibility("repeat")}
                                passwordRef={repeatPasswordRef}
                                error={errors.repeat}
                                hasError={!!errors.repeat}
                            />
                        </div>

                        {submitError && (
                            <p className={styles.submitError}>{submitError}</p>
                        )}

                        <div className={styles.buttons}>
                            <button
                                className={styles.btnSave}
                                onClick={() => handleSubmit(onSaveSuccess)}
                                disabled={!isDirty || isSubmitting}
                            >
                                {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                            </button>
                            <button className={styles.btnCancel} onClick={onClose} disabled={isSubmitting}>
                                Отмена
                            </button>
                        </div>
                    </>
                )}

                {step === EDIT_STEPS.VERIFYING && (
                    <EmailVerificationStep
                        email={email}
                        isSubmitting={isSubmitting}
                        onSuccess={() => handleVerificationSuccess(onSaveSuccess)}
                        onBack={handleBackToForm}
                    />
                )}
            </div>
        </div>
    );
};

export default EditProfileModal;
