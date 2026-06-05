import {describe, it, expect} from 'vitest';
import {
    HOURS,
    MINUTES,
    formatDateToDots,
    parseDotsToDate,
    applyDateMask,
    applyTimeMask,
    isValidTime
} from './dateTimeInputUtils.js';

describe('dateTimeInputUtils', () => {

    describe('Constants', () => {
        it('HOURS should contain 24 elements from "00" to "23"', () => {
            expect(HOURS).toHaveLength(24);
            expect(HOURS[0]).toBe('00');
            expect(HOURS[23]).toBe('23');
        });

        it('MINUTES should contain 60 elements from "00" to "59"', () => {
            expect(MINUTES).toHaveLength(60);
            expect(MINUTES[0]).toBe('00');
            expect(MINUTES[59]).toBe('59');
        });
    });

    describe('formatDateToDots', () => {
        it('should format Date object to DD.MM.YYYY string', () => {
            const date = new Date(2026, 4, 5);
            expect(formatDateToDots(date)).toBe('05.05.2026');
        });

        it('should return empty string if no date is provided', () => {
            expect(formatDateToDots(null)).toBe('');
        });
    });

    describe('parseDotsToDate', () => {
        it('should parse valid DD.MM.YYYY string to Date object', () => {
            const date = parseDotsToDate('31.05.2026');
            expect(date).toBeInstanceOf(Date);
            expect(date.getFullYear()).toBe(2026);
            expect(date.getMonth()).toBe(4);
            expect(date.getDate()).toBe(31);
        });

        it('should return null for invalid formats', () => {
            expect(parseDotsToDate('2026.05.31')).toBeNull();
            expect(parseDotsToDate('31/05/2026')).toBeNull();
            expect(parseDotsToDate('invalid')).toBeNull();
        });
    });

    describe('applyDateMask', () => {
        it('should format raw numbers as DD.MM.YYYY', () => {
            expect(applyDateMask('31')).toBe('31.');
            expect(applyDateMask('310')).toBe('31.0');
            expect(applyDateMask('3105')).toBe('31.05.');
            expect(applyDateMask('3105202')).toBe('31.05.202');
            expect(applyDateMask('31052026')).toBe('31.05.2026');
        });

        it('should strip non-digit characters and apply mask', () => {
            expect(applyDateMask('3a1.0b5')).toBe('31.05.');
        });

        it('should truncate input to 8 digits max', () => {
            expect(applyDateMask('310520269999')).toBe('31.05.2026');
        });
    });

    describe('applyTimeMask', () => {
        it('should format raw numbers as HH:MM', () => {
            expect(applyTimeMask('1')).toBe('1');
            expect(applyTimeMask('12')).toBe('12');
            expect(applyTimeMask('123')).toBe('12:3');
            expect(applyTimeMask('1234')).toBe('12:34');
        });

        it('should strip non-digit characters and truncate to 4 digits', () => {
            expect(applyTimeMask('1a2b3456')).toBe('12:34');
        });
    });

    describe('isValidTime', () => {
        it('should return true for valid time strings', () => {
            expect(isValidTime('00:00')).toBe(true);
            expect(isValidTime('23:59')).toBe(true);
            expect(isValidTime('09:05')).toBe(true);
        });

        it('should return false for invalid hours or minutes', () => {
            expect(isValidTime('24:00')).toBe(false);
            expect(isValidTime('12:60')).toBe(false);
            expect(isValidTime('99:99')).toBe(false);
        });

        it('should return false for badly formatted strings', () => {
            expect(isValidTime('12-30')).toBe(false);
            expect(isValidTime('1230')).toBe(false);
            expect(isValidTime('abc')).toBe(false);
        });
    });
});
