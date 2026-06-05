import {describe, it, expect} from 'vitest';
import {
    formatDate,
    formatDateTime,
    formatShortDateTime,
    parseISOToDate,
    formatTimeOnly,
    toUTCISO
} from './dateFormatter.js';

describe('dateFormatter utils', () => {
    describe('formatDate', () => {
        it('should return empty string if no dateString is provided', () => {
            expect(formatDate(null)).toBe('');
            expect(formatDate('')).toBe('');
        });

        it('should format DD/MM/YYYY to long date', () => {
            const result = formatDate('25/12/2023');
            expect(result).toContain('25');
            expect(result).toContain('декабря');
            expect(result).toContain('2023');
        });

        it('should return the original string if the parsed date is invalid', () => {
            expect(formatDate('invalid/date/string')).toBe('invalid/date/string');
        });
    });

    describe('formatDateTime', () => {
        it('should format ISO string to local date and time', () => {
            const iso = '2026-05-31T15:30:00.000Z';
            const result = formatDateTime(iso);
            expect(result).toContain('мая');
            expect(result).toContain(':');
        });

        it('should return original string for invalid ISO input', () => {
            expect(formatDateTime('invalid')).toBe('invalid');
        });
    });

    describe('formatShortDateTime', () => {
        it('should format ISO string to short date without dots', () => {
            const iso = '2026-05-31T15:30:00.000Z';
            const result = formatShortDateTime(iso);
            expect(result).toContain('мая');
            expect(result).not.toContain('.');
        });
    });

    describe('parseISOToDate', () => {
        it('should convert valid ISO string to Date object', () => {
            const iso = '2026-05-31T12:00:00.000Z';
            const date = parseISOToDate(iso);
            expect(date).toBeInstanceOf(Date);
            expect(date.toISOString()).toBe(iso);
        });

        it('should return null for invalid or empty ISO string', () => {
            expect(parseISOToDate('invalid')).toBeNull();
            expect(parseISOToDate(null)).toBeNull();
        });
    });

    describe('formatTimeOnly', () => {
        it('should return empty string if no date is provided', () => {
            expect(formatTimeOnly(null)).toBe('');
        });

        it('should format Date object to HH:MM string', () => {
            const date = new Date(2026, 4, 31, 14, 5);
            expect(formatTimeOnly(date)).toBe('14:05');
        });
    });

    describe('toUTCISO', () => {
        it('should combine date and time string into UTC ISO string', () => {
            const dateObj = new Date('2026-05-31T00:00:00Z');
            const result = toUTCISO(dateObj, '14:30');
            expect(new Date(result).getHours()).toBe(14);
            expect(new Date(result).getMinutes()).toBe(30);
        });

        it('should use 00:00 if time string is omitted', () => {
            const dateObj = new Date('2026-05-31T00:00:00Z');
            const result = toUTCISO(dateObj);
            expect(new Date(result).getHours()).toBe(0);
            expect(new Date(result).getMinutes()).toBe(0);
        });

        it('should return null if no dateObj is provided', () => {
            expect(toUTCISO(null, '14:30')).toBeNull();
        });
    });
});
