import { useState, useRef } from "react";
import { validateEmail } from "../utils/registerValidation.js";
import { VALIDATION_MESSAGES } from "../constants/validationMessages";

export const useLoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [authError, setAuthError] = useState("");

    const [submitted, setSubmitted] = useState(false);

    const passwordRef = useRef(null);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (emailError) {
            setEmailError("");
        }
        if (authError) {
            setAuthError("");
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        if (passwordError) {
            setPasswordError("");
        }
        if (authError) {
            setAuthError("");
        }
    };

    const handleEmailBlur = () => {
        if (submitted || email) {
            setEmailError(validateEmail(email, submitted));
        }
    };

    const handlePasswordBlur = () => {
        if (submitted || password) {
            if (!password.trim()) {
                setPasswordError(submitted ? VALIDATION_MESSAGES.REQUIRED : "");
            }
        }
    };

    const togglePasswordVisibility = () => {
        const cursorPosition = passwordRef.current?.selectionStart;
        setShowPassword(prev => !prev);

        requestAnimationFrame(() => {
            if (passwordRef.current && document.activeElement === passwordRef.current) {
                passwordRef.current.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    };

    const validateForm = () => {
        setSubmitted(true);

        const emailValidation = validateEmail(email, true);
        const passwordValidation = !password.trim() ? VALIDATION_MESSAGES.REQUIRED : "";

        setEmailError(emailValidation);
        setPasswordError(passwordValidation);

        return !emailValidation && !passwordValidation;
    };

    const setAuthenticationError = (message) => {
        setAuthError(message);
    };

    return {
        email,
        password,
        showPassword,
        emailError,
        passwordError,
        authError,
        passwordRef,

        handleEmailChange,
        handlePasswordChange,
        handleEmailBlur,
        handlePasswordBlur,
        togglePasswordVisibility,
        validateForm,
        setAuthenticationError
    };
};
