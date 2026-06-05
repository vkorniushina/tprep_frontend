import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {buildWeekData, computeTicks} from './weekChartUtils.js';

describe('weekChartUtils', () => {
    const mockNow = new Date('2026-05-31T12:00:00Z');

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(mockNow);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('buildWeekData', () => {
        it('should generate an array of 7 days ending with today', () => {
            const activity = [];
            const result = buildWeekData(activity);

            expect(result).toHaveLength(7);
            expect(result[6].date).toBe('2026-05-31');
            expect(result[0].date).toBe('2026-05-25');
        });

        it('should correctly map activity counts to dates', () => {
            const activity = [
                {date: '2026-05-31', count: 5},
                {date: '2026-05-28', count: 2}
            ];
            const result = buildWeekData(activity);

            expect(result[6].count).toBe(5);
            expect(result[3].count).toBe(2);
            expect(result[0].count).toBe(0);
        });

        it('should set count to 0 if there is no activity for the date', () => {
            const result = buildWeekData([]);
            const allZero = result.every(item => item.count === 0);
            expect(allZero).toBe(true);
        });
    });

    describe('computeTicks', () => {
        it('should return a default tick array if counts are low or empty', () => {
            const result = computeTicks([0, 0, 0]);
            expect(result).toEqual([4, 3, 2, 1, 0]);
        });

        it('should dynamically calculate ticks based on higher counts', () => {
            const result = computeTicks([5, 15, 20]);
            expect(result).toEqual([20, 15, 10, 5, 0]);
        });

        it('should handle fractional steps correctly using Math.ceil', () => {
            const result = computeTicks([10, 13, 22]);
            expect(result).toEqual([24, 18, 12, 6, 0]);
        });
    });
});
