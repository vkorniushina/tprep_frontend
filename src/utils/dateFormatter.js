export const formatDate = (dateString) => {
    if (!dateString) return '';

    const [day, month, year] = dateString.split('/');
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

export const formatDateTime = (isoString) => {
    if (!isoString) return '';

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const datePart = date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
    });

    const timePart = date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return `${datePart}, ${timePart}`;
};

export const formatShortDateTime = (isoString) => {
    if (!isoString) return '';

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    let datePart = date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
    });
    datePart = datePart.replace('.', '');

    const timePart = date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return `${datePart}, ${timePart}`;
};

export const parseISOToDate = (isoString) => {
    if (!isoString) return null;
    const d = new Date(isoString);
    return isNaN(d.getTime()) ? null : d;
};

export const formatTimeOnly = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const toUTCISO = (dateObj, timeStr) => {
    if (!dateObj) return null;

    const d = new Date(dateObj);
    const [h, m] = (timeStr || "00:00").split(":").map(Number);
    d.setHours(h, m, 0, 0);

    return d.toISOString();
};
