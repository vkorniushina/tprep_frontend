import {VALIDATION_MESSAGES, REGEX} from "../constants/validationMessages";

export const validateName = (value, checkEmpty = false) => {
    if (!value.trim()) {
        return checkEmpty ? VALIDATION_MESSAGES.REQUIRED : "";
    }
    if (value.length < 3 || value.length > 20) {
        return VALIDATION_MESSAGES.NAME_LENGTH;
    }
    if (!REGEX.NAME_START.test(value)) {
        return VALIDATION_MESSAGES.NAME_START;
    }
    if (!REGEX.NAME_VALID.test(value)) {
        return VALIDATION_MESSAGES.NAME_CHARS;
    }
    return "";
};

export const validateEmail = (value, checkEmpty = false) => {
    if (!value.trim()) {
        return checkEmpty ? VALIDATION_MESSAGES.REQUIRED : "";
    }
    if (!REGEX.EMAIL.test(value)) {
        return VALIDATION_MESSAGES.EMAIL_INVALID;
    }
    return "";
};

export const validatePasswordEmpty = (value) => {
    if (!value) {
        return VALIDATION_MESSAGES.REQUIRED;
    }
    return "";
};

export const validatePasswordConfirm = (value, passwordValue, checkEmpty = false) => {
    if (!value) {
        return checkEmpty ? VALIDATION_MESSAGES.REQUIRED : "";
    }
    if (value !== passwordValue) {
        return VALIDATION_MESSAGES.PASSWORDS_MISMATCH;
    }
    return "";
};

export const validateTerms = (value) => {
    if (!value) {
        return VALIDATION_MESSAGES.TERMS_REQUIRED;
    }
    return "";
};

export const checkPasswordStrength = (value, currentName, currentEmail) => {
    if (!value) {
        return {strength: null, hint: ""};
    }

    const hasUpperCase = REGEX.UPPERCASE.test(value);
    const hasLowerCase = REGEX.LOWERCASE.test(value);
    const hasDigits = REGEX.DIGITS.test(value);
    const hasSpecialChars = REGEX.SPECIAL_CHARS.test(value);

    const typesCount = [hasUpperCase, hasLowerCase, hasDigits, hasSpecialChars].filter(Boolean).length;

    if (value.length < 8) {
        return {strength: 'weak', hint: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH};
    }

    const onlyDigits = REGEX.ONLY_DIGITS.test(value);
    const onlyLowerCase = REGEX.ONLY_LOWERCASE.test(value);
    const onlyUpperCase = REGEX.ONLY_UPPERCASE.test(value);

    if (onlyDigits || onlyLowerCase || onlyUpperCase) {
        return {strength: 'weak', hint: VALIDATION_MESSAGES.PASSWORD_VARIETY};
    }

    const lowerValue = value.toLowerCase();
    const lowerName = currentName.toLowerCase().trim();
    const lowerEmail = currentEmail.toLowerCase().trim();

    if (lowerName && lowerValue === lowerName) {
        return {strength: 'weak', hint: VALIDATION_MESSAGES.PASSWORD_NAME_MATCH};
    }

    if (lowerEmail && lowerValue === lowerEmail) {
        return {strength: 'weak', hint: VALIDATION_MESSAGES.PASSWORD_EMAIL_MATCH};
    }

    if (value.length >= 12 && typesCount === 4) {
        return {strength: 'strong', hint: VALIDATION_MESSAGES.PASSWORD_STRONG};
    }

    if (value.length < 12) {
        return {strength: 'medium', hint: VALIDATION_MESSAGES.PASSWORD_WEAK_ADD_CHARS};
    }
    if (!hasSpecialChars) {
        return {strength: 'medium', hint: VALIDATION_MESSAGES.PASSWORD_ADD_SPECIAL};
    }
    if (!hasDigits) {
        return {strength: 'medium', hint: VALIDATION_MESSAGES.PASSWORD_ADD_DIGITS};
    }
    if (!hasUpperCase || !hasLowerCase) {
        return {strength: 'medium', hint: VALIDATION_MESSAGES.PASSWORD_ADD_CASE};
    }

    return {strength: 'medium', hint: ""};
};
