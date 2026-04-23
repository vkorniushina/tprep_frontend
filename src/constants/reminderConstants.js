export const MODAL_MODES = {
    ADD: 'add',
    EDIT: 'edit',
};

export const REMINDER_MODES = {
    INTERVAL: 'INTERVAL',
    MANUAL: 'MANUAL',
};

export const VALIDATION_ERRORS = {
    EMPTY: "empty",
    PAST: "past",
};

export const INTERVALS = [
    {label: "Через 20 минут", minutes: 20},
    {label: "Через 1 день", minutes: 60 * 24},
    {label: "Через 3 дня", minutes: 60 * 24 * 3},
    {label: "Через 7 дней", minutes: 60 * 24 * 7},
    {label: "Через 30 дней", minutes: 60 * 24 * 30},
];

export const MODE_BUTTONS = [
    {
        id: REMINDER_MODES.INTERVAL,
        title: "Интервальный",
        sub: "Система рассчитает даты и время автоматически",
    },
    {
        id: REMINDER_MODES.MANUAL,
        title: "Вручную",
        sub: "Задайте даты и время самостоятельно",
    },
];
