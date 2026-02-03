import {ALLOWED_FILE_EXTENSIONS, ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILE_SIZE_MB} from "../constants/fileUpload.js";

export const validateTestForm = (name, description) => {
    const errors = {};

    if (!name.trim()) {
        errors.name = "Обязательное поле";
    } else if (name.length < 2) {
        errors.name = "Минимальная длина — 2 символа";
    } else if (name.length > 70) {
        errors.name = "Слишком длинное название";
    }

    if (description.length > 255) {
        errors.description = "Слишком длинное описание";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

export const validateFile = (file) => {

    if (!file) {
        return {error: "Прикрепите файл для создания теста"};
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return {
            error: `Неподдерживаемый формат файла. Допустимо: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            error: `Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE_MB} МБ.`
        };
    }

    return {error: null};
};
