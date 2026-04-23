import {formatTimeOnly, parseISOToDate, toUTCISO} from "./dateFormatter.js";
import {INTERVALS, REMINDER_MODES, VALIDATION_ERRORS} from "../constants/reminderConstants.js";
import {v4 as uuidv4} from 'uuid';
import {VALIDATION_MESSAGES} from "../constants/validationMessages.js";

export const buildIntervalRows = (baseDate) => {
    const base = baseDate ? new Date(baseDate) : new Date();
    return INTERVALS.map((interval) => {
        const dt = new Date(base.getTime() + interval.minutes * 60 * 1000);
        return {
            id: uuidv4(),
            label: interval.label,
            dateObj: dt,
            time: formatTimeOnly(dt),
        };
    });
};

export const parseRemindersToRows = (reminders, mode) => {
    if (mode === REMINDER_MODES.INTERVAL) {
        const skipped = Math.max(0, INTERVALS.length - reminders.length);
        return reminders.map((r, i) => ({
            id: r.id,
            label: INTERVALS[skipped + i]?.label ?? `Повторение ${i + 1}`,
            dateObj: parseISOToDate(r.datetime),
            time: formatTimeOnly(parseISOToDate(r.datetime)),
        }));
    }
    return reminders.map((r) => ({
        id: r.id,
        dateObj: parseISOToDate(r.datetime),
        time: formatTimeOnly(parseISOToDate(r.datetime)),
    }));
};

export const validateRows = (rows) => {
    const now = new Date();
    return rows.map((row) => {
        if (!row.dateObj || !row.time) return VALIDATION_ERRORS.EMPTY;

        const dt = toUTCISO(row.dateObj, row.time);
        if (dt && new Date(dt) < now) return VALIDATION_ERRORS.PAST;

        return null;
    });
};

export const getValidationMessage = (rowErrors) => {
    if (rowErrors.some((e) => e === VALIDATION_ERRORS.EMPTY)) {
        return VALIDATION_MESSAGES.REMINDER_EMPTY;
    }
    if (rowErrors.some((e) => e === VALIDATION_ERRORS.PAST)) {
        return VALIDATION_MESSAGES.REMINDER_PAST;
    }
    return null;
};

export const sortRowsByDate = (rows) => {
    return [...rows].sort((a, b) => (a.dateObj?.getTime() ?? 0) - (b.dateObj?.getTime() ?? 0));
};

const getNearestFutureTime = (reminders) => {
    const now = Date.now();
    const futureTimes = reminders
        .map(r => new Date(r.datetime).getTime())
        .filter(t => t >= now);

    return futureTimes.length > 0 ? Math.min(...futureTimes) : Infinity;
};

export const sortRemindersByNearest = (data) => {
    return [...data].sort((a, b) => {
        const timeA = getNearestFutureTime(a.reminders || []);
        const timeB = getNearestFutureTime(b.reminders || []);
        return timeA - timeB;
    });
};
