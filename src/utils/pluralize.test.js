import {describe, it, expect} from 'vitest';
import {getPluralForm, formatPassings} from './pluralize.js';

describe('pluralize utility', () => {
    const questionForms = ['вопрос', 'вопроса', 'вопросов'];

    describe('getPluralForm', () => {
        it('should return "one" form for numbers ending in 1 (except 11)', () => {
            expect(getPluralForm(1, ...questionForms)).toBe('вопрос');
            expect(getPluralForm(21, ...questionForms)).toBe('вопрос');
            expect(getPluralForm(101, ...questionForms)).toBe('вопрос');
        });

        it('should return "few" form for numbers ending in 2, 3, 4 (except 12-14)', () => {
            expect(getPluralForm(2, ...questionForms)).toBe('вопроса');
            expect(getPluralForm(4, ...questionForms)).toBe('вопроса');
            expect(getPluralForm(23, ...questionForms)).toBe('вопроса');
        });

        it('should return "many" form for numbers ending in 5-9, 0', () => {
            expect(getPluralForm(0, ...questionForms)).toBe('вопросов');
            expect(getPluralForm(5, ...questionForms)).toBe('вопросов');
            expect(getPluralForm(10, ...questionForms)).toBe('вопросов');
        });

        it('should return "many" form for teens (11-19)', () => {
            expect(getPluralForm(11, ...questionForms)).toBe('вопросов');
            expect(getPluralForm(14, ...questionForms)).toBe('вопросов');
            expect(getPluralForm(112, ...questionForms)).toBe('вопросов');
        });

        it('should handle absolute values for negative numbers', () => {
            expect(getPluralForm(-1, ...questionForms)).toBe('вопрос');
            expect(getPluralForm(-2, ...questionForms)).toBe('вопроса');
            expect(getPluralForm(-5, ...questionForms)).toBe('вопросов');
        });
    });

    describe('formatPassings', () => {
        it('should return a formatted string with the correct plural noun (hardcoded to "прохождение")', () => {
            expect(formatPassings(1)).toBe('1 прохождение');
            expect(formatPassings(23)).toBe('23 прохождения');
            expect(formatPassings(50)).toBe('50 прохождений');
        });
    });
});
