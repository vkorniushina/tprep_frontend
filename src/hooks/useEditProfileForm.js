import {useState, useRef} from "react";
import {
    validateName,
    validateEmail,
    validatePasswordConfirm,
    checkPasswordStrength
} from "../utils/registerValidation.js";
import {validateCurrentPassword} from "../utils/editProfileValidation.js";
import {PASSWORD_STRENGTH} from "../constants/passwordStrength.js";
import {VALIDATION_MESSAGES} from "../constants/validationMessages.js";
import {updateProfile, changePassword} from "../api/profile.js";
import {sendVerificationCode} from "../api/auth.js";
import {EDIT_STEPS} from "../constants/profileConstants.js";

export const useEditProfileForm = (user) => {
    const [name, setName] = useState(user.username);
    const [email, setEmail] = useState(user.email);

    const [passwords, setPasswords] = useState({current: "", new: "", repeat: ""});
    const [show, setShow] = useState({current: false, new: false, repeat: false});
    const [errors, setErrors] = useState({name: "", email: "", current: "", new: "", repeat: ""});

    const [passwordStrength, setPasswordStrength] = useState(null);
    const [passwordHint, setPasswordHint] = useState("");

    const [step, setStep] = useState(EDIT_STEPS.FORM);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const currentPasswordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const repeatPasswordRef = useRef(null);

    const refs = {current: currentPasswordRef, new: newPasswordRef, repeat: repeatPasswordRef};

    const setPassword = (field, value) => {
        setPasswords(prev => ({...prev, [field]: value}));
    };

    const clearError = (field) => {
        setErrors(prev => ({...prev, [field]: ""}));
    };

    const clearSubmitError = () => {
        if (submitError) setSubmitError("");
    };

    const toggleVisibility = (field) => {
        const ref = refs[field];
        const pos = ref.current?.selectionStart;

        setShow(prev => ({...prev, [field]: !prev[field]}));

        requestAnimationFrame(() => {
            if (ref.current && document.activeElement === ref.current) {
                ref.current.setSelectionRange(pos, pos);
            }
        });
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        clearError("name");
        clearSubmitError();
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        clearError("email");
        clearSubmitError();
    };

    const handleCurrentPasswordChange = (e) => {
        setPassword("current", e.target.value);
        clearError("current");
        clearSubmitError();
    };

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setPassword("new", value);
        clearError("new");
        clearSubmitError();

        const {strength, hint} = checkPasswordStrength(value, name, email);
        setPasswordStrength(strength);
        setPasswordHint(hint);

        if (passwords.repeat) {
            setErrors(prev => ({
                ...prev,
                repeat: validatePasswordConfirm(passwords.repeat, value, true),
            }));
        }
    };

    const handleRepeatPasswordChange = (e) => {
        setPassword("repeat", e.target.value);
        clearError("repeat");
    };

    const handleNameBlur = () => {
        setErrors(prev => ({...prev, name: validateName(name, true)}));
    };

    const handleEmailBlur = () => {
        setErrors(prev => ({...prev, email: validateEmail(email, true)}));
    };

    const handleRepeatPasswordBlur = () => {
        const {current, new: newPass, repeat} = passwords;
        if (!current && !newPass && !repeat) return;
        if (!repeat) return;
        setErrors(prev => ({
            ...prev,
            repeat: validatePasswordConfirm(repeat, newPass, true),
        }));
    };

    const validateForm = () => {
        const {current, new: newPass, repeat} = passwords;
        const passwordSectionTouched = current || newPass || repeat;

        let newPassErr = "";
        let isWeakPassword = false;

        if (passwordSectionTouched) {
            if (!newPass) {
                newPassErr = VALIDATION_MESSAGES.REQUIRED;
            } else {
                const {strength} = checkPasswordStrength(newPass, name, email);
                if (strength === PASSWORD_STRENGTH.WEAK) {
                    isWeakPassword = true;
                }
            }
        }

        const nextErrors = {
            name: validateName(name, true),
            email: validateEmail(email, true),
            current: validateCurrentPassword(current, newPass, repeat),
            new: newPassErr,
            repeat: passwordSectionTouched
                ? validatePasswordConfirm(repeat, newPass, true)
                : "",
        };

        setErrors(nextErrors);

        const hasErrors = Object.values(nextErrors).some(Boolean);
        return !hasErrors && !isWeakPassword;
    };

    const applyPasswordChange = async () => {
        try {
            await changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.new,
            });
            return true;
        } catch (err) {
            if (err.response?.status === 400) {
                setErrors(prev => ({...prev, current: "Неверный текущий пароль"}));
                setStep(EDIT_STEPS.FORM);
            } else {
                setSubmitError("Не удалось сменить пароль. Попробуйте позже.");
            }
            return false;
        }
    };

    const applyProfileUpdate = async () => {
        try {
            await updateProfile({username: name, email});
            return true;
        } catch (err) {
            if (err.response?.status === 409) {
                setErrors(prev => ({...prev, email: "Этот email уже используется"}));
                setStep(EDIT_STEPS.FORM);
            } else {
                setSubmitError("Ошибка сохранения. Попробуйте позже.");
            }
            return false;
        }
    };

    const handleSubmit = async (onSuccess) => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitError("");

        const isEmailChanging = email !== user.email;
        const isNameChanging = name !== user.username;
        const isPasswordChanging = !!(passwords.current && passwords.new);

        try {
            if (isEmailChanging) {
                try {
                    await sendVerificationCode(email);
                } catch {
                    setErrors(prev => ({...prev, email: "Не удалось отправить код. Попробуйте позже."}));
                    return;
                }
                setStep(EDIT_STEPS.VERIFYING);
                return;
            }

            if (isPasswordChanging) {
                const ok = await applyPasswordChange();
                if (!ok) return;
            }

            if (isNameChanging) {
                const ok = await applyProfileUpdate();
                if (!ok) return;
            }

            onSuccess();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerificationSuccess = async (onSuccess) => {
        setIsSubmitting(true);
        setSubmitError("");

        const isPasswordChanging = !!(passwords.current && passwords.new);

        try {
            if (isPasswordChanging) {
                const ok = await applyPasswordChange();
                if (!ok) return;
            }

            const ok = await applyProfileUpdate();
            if (!ok) return;

            onSuccess();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToForm = () => setStep(EDIT_STEPS.FORM);

    const isDirty = name !== user.username
        || email !== user.email
        || !!(passwords.current || passwords.new || passwords.repeat);

    return {
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
    };
};
