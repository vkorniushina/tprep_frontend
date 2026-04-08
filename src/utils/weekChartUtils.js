export const CHART_CONFIG = {
    HEIGHT: 190,
    TICKS_COUNT: 5,
    BAR_MIN_HEIGHT: 8,
};

export function buildWeekData(activity) {
    const activityByDate = Object.fromEntries(activity.map(d => [d.date, d.count]));
    const today = new Date();

    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));
        const key = date.toISOString().slice(0, 10);
        return {
            date: key,
            count: activityByDate[key] || 0,
            rawDate: date
        };
    });
}

export function computeTicks(counts) {
    const max = Math.max(...counts, 4);
    const step = Math.ceil(max / (CHART_CONFIG.TICKS_COUNT - 1));
    const top = step * (CHART_CONFIG.TICKS_COUNT - 1);
    return Array.from({ length: CHART_CONFIG.TICKS_COUNT }, (_, i) => top - i * step);
}
