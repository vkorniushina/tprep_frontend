import {MONTH_NAMES_SHORT} from "../constants/dateConstants.js";

export const WEEKS = 53;

export function getActivityLevel(count) {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    return 3;
}

export function generateHeatmapData(activity) {
    const map = Object.fromEntries(activity.map(d => [d.date, d.count]));

    const today = new Date();
    const dow = (today.getDay() + 6) % 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dow - (WEEKS - 1) * 7);

    const columns = [];
    const monthLabels = {};
    let lastMonth = -1;

    for (let w = 0; w < WEEKS; w++) {
        const cells = [];
        for (let d = 0; d < 7; d++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + w * 7 + d);

            if (date > today) {
                cells.push(null);
                continue;
            }

            const key = date.toISOString().slice(0, 10);
            const month = date.getMonth();

            if (d === 0 && month !== lastMonth) {
                monthLabels[w] = MONTH_NAMES_SHORT[month];
                lastMonth = month;
            }

            cells.push({key, count: map[key] ?? 0, date});
        }
        columns.push(cells);
    }

    return {columns, monthLabels};
}
