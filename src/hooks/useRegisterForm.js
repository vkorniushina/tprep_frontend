import {useState, useRef} from "react";
import {
    validateName,
    validateEmail,
    validatePasswordEmpty,
    validatePasswordConfirm,
    validateTerms,
    checkPasswordStrength
} from "../utils/registerValidation.js";
import {PASSWORD_STRENGTH} from "../constants/passwordStrength.js";

export const useRegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(true);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");
    const [termsError, setTermsError] = useState("");

    const [passwordStrength, setPasswordStrength] = useState(null);
    const [passwordHint, setPasswordHint] = useState("");

    const passwordRef = useRef(null);
    const passwordConfirmRef = useRef(null);

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);

        if (nameError) {
            setNameError("");
        }

        if (password) {
            const {strength, hint} = checkPasswordStrength(password, value, email);
            setPasswordStrength(strength);
            setPasswordHint(hint);
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (emailError) {
            setEmailError("");
        }

        if (password) {
            const {strength, hint} = checkPasswordStrength(password, name, value);
            setPasswordStrength(strength);
            setPasswordHint(hint);
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        if (passwordError) {
            setPasswordError("");
        }

        if (value) {
            const {strength, hint} = checkPasswordStrength(value, name, email);
            setPasswordStrength(strength);
            setPasswordHint(hint);
        } else {
            setPasswordStrength(null);
            setPasswordHint("");
        }

        if (passwordConfirm) {
            const error = validatePasswordConfirm(passwordConfirm, value, submitted);
            setPasswordConfirmError(error);
        }
    };

    const handlePasswordConfirmChange = (e) => {
        const value = e.target.value;
        setPasswordConfirm(value);

        if (passwordConfirmError) {
            setPasswordConfirmError("");
        }
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
        if (termsError) {
            setTermsError("");
        }
    };

    const handleNameBlur = () => {
        setNameError(validateName(name, submitted));
    };

    const handleEmailBlur = () => {
        setEmailError(validateEmail(email, submitted));
    };

    const handlePasswordConfirmBlur = () => {
        setPasswordConfirmError(validatePasswordConfirm(passwordConfirm, password, submitted));
    };

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

    const validateForm = () => {
        setSubmitted(true);

        const nameValidation = validateName(name, true);
        const emailValidation = validateEmail(email, true);
        const passwordEmptyValidation = validatePasswordEmpty(password);
        const passwordConfirmValidation = validatePasswordConfirm(passwordConfirm, password, true);
        const termsValidation = validateTerms(termsAccepted);

        setNameError(nameValidation);
        setEmailError(emailValidation);
        setPasswordError(passwordEmptyValidation);
        setPasswordConfirmError(passwordConfirmValidation);
        setTermsError(termsValidation);

        if (nameValidation || emailValidation || passwordEmptyValidation || passwordConfirmValidation || termsValidation) {
            return false;
        }

        if (passwordStrength === PASSWORD_STRENGTH.WEAK) {
            return false;
        }

        return true;
    };

    return {
        name,
        email,
        password,
        passwordConfirm,
        termsAccepted,
        showPassword,
        showPasswordConfirm,

        nameError,
        emailError,
        passwordError,
        passwordConfirmError,
        termsError,

        passwordStrength,
        passwordHint,
        passwordRef,
        passwordConfirmRef,

        handleNameChange,
        handleEmailChange,
        handlePasswordChange,
        handlePasswordConfirmChange,
        handleTermsChange,
        handleNameBlur,
        handleEmailBlur,
        handlePasswordConfirmBlur,
        togglePasswordVisibility,
        validateForm
    };
};
