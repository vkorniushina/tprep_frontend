import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {validateRows, sortRowsByDate, sortRemindersByNearest} from './reminderUtils.js';
import {VALIDATION_ERRORS} from '../constants/reminderConstants.js';

vi.mock('./dateFormatter.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        toUTCISO: (dateObj, time) => {
            if (!dateObj || !time) return null;
            const [hours, minutes] = time.split(':');
            const newDate = new Date(dateObj);
            newDate.setHours(hours, minutes, 0, 0);
            return newDate.toISOString();
        }
    };
});

describe('reminderUtils', () => {
    const mockNow = new Date('2026-05-30T12:00:00Z');

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(mockNow);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('validateRows', () => {
        it('should return EMPTY if date or time is missing', () => {
            const rows = [{dateObj: null, time: '10:00'}, {dateObj: new Date(), time: ''}];
            const result = validateRows(rows);
            expect(result).toEqual([VALIDATION_ERRORS.EMPTY, VALIDATION_ERRORS.EMPTY]);
        });

        it('should return PAST for dates in the past', () => {
            const pastDate = new Date('2026-05-29T10:00:00Z');
            const rows = [{dateObj: pastDate, time: '10:00'}];
            const result = validateRows(rows);
            expect(result).toEqual([VALIDATION_ERRORS.PAST]);
        });

        it('should return null for valid future dates', () => {
            const futureDate = new Date('2026-05-31T10:00:00Z');
            const rows = [{dateObj: futureDate, time: '10:00'}];
            const result = validateRows(rows);
            expect(result).toEqual([null]);
        });
    });

    describe('sortRowsByDate', () => {
        it('should sort rows in ascending order by date', () => {
            const date1 = new Date('2026-06-01');
            const date2 = new Date('2026-05-31');
            const rows = [{id: 1, dateObj: date1}, {id: 2, dateObj: date2}];

            const sorted = sortRowsByDate(rows);
            expect(sorted[0].id).toBe(2);
            expect(sorted[1].id).toBe(1);
        });
    });

    describe('sortRemindersByNearest', () => {
        it('should sort tests by the nearest future reminder', () => {
            const data = [
                {id: 'test1', reminders: [{datetime: '2026-06-10T10:00:00Z'}]},
                {id: 'test2', reminders: [{datetime: '2026-05-31T10:00:00Z'}]},
                {id: 'test3', reminders: [{datetime: '2026-05-29T10:00:00Z'}]},
            ];

            const sorted = sortRemindersByNearest(data);
            expect(sorted[0].id).toBe('test2');
            expect(sorted[1].id).toBe('test1');
            expect(sorted[2].id).toBe('test3');
        });
    });
});
