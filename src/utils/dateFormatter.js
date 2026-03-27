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
