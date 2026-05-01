export const ACCESS_MODES = {
    PRIVATE: "PRIVATE",
    PUBLIC: "PUBLIC",
    LINK: "LINK",
};

export const ACCESS_OPTIONS = [
    { id: ACCESS_MODES.PRIVATE, title: "Приватный", sub: "Доступен только вам" },
    { id: ACCESS_MODES.PUBLIC, title: "Публичный", sub: "Доступен всем пользователям" },
    { id: ACCESS_MODES.LINK, title: "Доступ по ссылке", sub: "Доступен всем, у кого есть ссылка" },
];
