import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {getActivityLevel, generateHeatmapData, WEEKS} from './yearHeatmapUtils.js';

describe('yearHeatmapUtils', () => {
    const mockNow = new Date('2026-05-31T12:00:00Z');

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(mockNow);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('getActivityLevel', () => {
        it('should return 0 for count 0', () => {
            expect(getActivityLevel(0)).toBe(0);
        });

        it('should return 1 for counts 1 and 2', () => {
            expect(getActivityLevel(1)).toBe(1);
            expect(getActivityLevel(2)).toBe(1);
        });

        it('should return 2 for counts 3 and 4', () => {
            expect(getActivityLevel(3)).toBe(2);
            expect(getActivityLevel(4)).toBe(2);
        });

        it('should return 3 for counts greater than 4', () => {
            expect(getActivityLevel(5)).toBe(3);
            expect(getActivityLevel(10)).toBe(3);
        });
    });

    describe('generateHeatmapData', () => {
        it('should generate the correct number of weeks (columns)', () => {
            const {columns} = generateHeatmapData([]);
            expect(columns).toHaveLength(WEEKS);
        });

        it('should generate exactly 7 cells for each week', () => {
            const {columns} = generateHeatmapData([]);
            columns.forEach(week => {
                expect(week).toHaveLength(7);
            });
        });

        it('should map activity counts to the correct dates', () => {
            const activity = [{date: '2026-05-31', count: 7}];
            const {columns} = generateHeatmapData(activity);

            const currentWeek = columns[columns.length - 1];
            const validDays = currentWeek.filter(day => day !== null);
            const todayCell = validDays[validDays.length - 1];

            expect(todayCell.key).toBe('2026-05-31');
            expect(todayCell.count).toBe(7);
        });

        it('should return null for future dates', () => {
            vi.setSystemTime(new Date('2026-05-27T12:00:00Z'));
            const {columns} = generateHeatmapData([]);

            const currentWeek = columns[columns.length - 1];

            expect(currentWeek[0]).not.toBeNull();
            expect(currentWeek[2]).not.toBeNull();
            expect(currentWeek[3]).toBeNull();
            expect(currentWeek[6]).toBeNull();
        });

        it('should generate month labels at the start of new months', () => {
            const {monthLabels} = generateHeatmapData([]);

            expect(typeof monthLabels).toBe('object');
            expect(Object.keys(monthLabels).length).toBeGreaterThan(0);

            const hasMay = Object.values(monthLabels).includes('Май');
            expect(hasMay).toBe(true);
        });
    });
});
