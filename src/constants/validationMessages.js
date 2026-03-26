export const VALIDATION_MESSAGES = {
    REQUIRED: "Обязательное поле",
    NAME_LENGTH: "Длина имени: 3-20 символов",
    NAME_START: "Имя должно начинаться с буквы",
    NAME_CHARS: "Разрешены только буквы, цифры, дефис и подчеркивание",
    EMAIL_INVALID: "Введите корректный email",
    PASSWORDS_MISMATCH: "Пароли не совпадают",
    TERMS_REQUIRED: "Необходимо принять условия",
    PASSWORD_MIN_LENGTH: "Минимум 8 символов",
    PASSWORD_VARIETY: "Используйте буквы разного регистра и цифры",
    PASSWORD_NAME_MATCH: "Пароль не должен совпадать с именем",
    PASSWORD_EMAIL_MATCH: "Пароль не должен совпадать с email",
    PASSWORD_WEAK_ADD_CHARS: "Для надежности добавьте символы",
    PASSWORD_ADD_SPECIAL: "Добавьте спецсимволы (!@#$%^&*)",
    PASSWORD_ADD_DIGITS: "Добавьте цифры для усиления пароля",
    PASSWORD_ADD_CASE: "Используйте буквы разного регистра",
    PASSWORD_STRONG: "Надежный пароль"
};

export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    NAME_START: /^[a-zA-Zа-яА-ЯёЁ]/,
    NAME_VALID: /^[a-zA-Zа-яА-ЯёЁ0-9 _-]+$/,
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    DIGITS: /\d/,
    SPECIAL_CHARS: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    ONLY_DIGITS: /^\d+$/,
    ONLY_LOWERCASE: /^[a-z]+$/,
    ONLY_UPPERCASE: /^[A-Z]+$/
};
