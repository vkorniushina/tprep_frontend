import { QUESTION_TYPES } from "../constants/questionTypes.js";

export const validateModuleForm = (title, description, questions) => {
    let hasErrors = false;
    const formErrors = {};
    const questionErrors = {};

    let firstError = { type: null, id: null };

    if (!title.trim()) {
        formErrors.title = "Обязательное поле";
        if (!firstError.type) firstError = { type: "form", id: "title" };
        hasErrors = true;
    } else if (title.length < 2) {
        formErrors.title = "Минимальная длина — 2 символа";
        if (!firstError.type) firstError = { type: "form", id: "title" };
        hasErrors = true;
    } else if (title.length > 70) {
        formErrors.title = "Слишком длинное название";
        if (!firstError.type) firstError = { type: "form", id: "title" };
        hasErrors = true;
    }

    if (description.length > 255) {
        formErrors.description = "Слишком длинное описание";
        if (!firstError.type) firstError = { type: "form", id: "description" };
        hasErrors = true;
    }

    questions.forEach((q) => {
        const qError = {};
        let qHasError = false;

        if (!q.text.trim()) {
            qError.text = "Обязательное поле";
            if (!firstError.type) firstError = { type: "question", id: q.id };
            qHasError = true;
        } else if (q.text.length > 200) {
            qError.text = "Слишком длинный текст вопроса";
            if (!firstError.type) firstError = { type: "question", id: q.id };
            qHasError = true;
        }

        if (q.type === QUESTION_TYPES.INPUT) {
            const answerContent = q.answers?.[0]?.content || "";
            if (!answerContent.trim()) {
                qError.answer = "Обязательное поле";
                if (!firstError.type) firstError = { type: "question", id: q.id };
                qHasError = true;
            } else if (answerContent.length > 150) {
                qError.answer = "Слишком длинный ответ";
                if (!firstError.type) firstError = { type: "question", id: q.id };
                qHasError = true;
            }
        }

        if (q.type === QUESTION_TYPES.CHOICE) {
            const options = q.options || [];

            if (options.length < 2) {
                qError.optionsHelper = "Добавьте минимум два варианта ответа";
                if (!firstError.type) firstError = { type: "question", id: q.id };
                qHasError = true;
            }

            if (!options.some(opt => opt.isCorrect)) {
                qError.optionsHelper = qError.optionsHelper
                    ? qError.optionsHelper + ". Отметьте хотя бы один правильный вариант"
                    : "Отметьте хотя бы один вариант как правильный";
                if (!firstError.type) firstError = { type: "question", id: q.id };
                qHasError = true;
            }

            const optionContentErrors = [];
            options.forEach((opt) => {
                const optErr = {};
                if (!opt.content.trim()) {
                    optErr.content = "Введите текст";
                    if (!firstError.type) firstError = { type: "question", id: q.id };
                    qHasError = true;
                } else if (opt.content.length > 100) {
                    optErr.content = "Слишком длинный ответ";
                    if (!firstError.type) firstError = { type: "question", id: q.id };
                    qHasError = true;
                } else {
                    optErr.content = "";
                }
                optionContentErrors.push(optErr);
            });

            if (optionContentErrors.some(err => err.content)) {
                qError.optionContent = optionContentErrors;
            }
        }

        if (qHasError) {
            questionErrors[q.id] = qError;
            hasErrors = true;
        }
    });

    return {
        isValid: !hasErrors,
        formErrors,
        questionErrors,
        firstError
    };
};
