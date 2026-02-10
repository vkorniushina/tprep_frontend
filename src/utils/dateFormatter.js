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
