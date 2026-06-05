import {describe, it, expect} from 'vitest';
import {validateModuleForm} from './validateEditTest.js';
import {QUESTION_TYPES} from '../constants/questionTypes.js';

describe('validateEditTest', () => {

    describe('form fields validation (title and description)', () => {
        it('should pass validation for a valid form with no questions', () => {
            const result = validateModuleForm('New Test', 'Valid description', []);
            expect(result.isValid).toBe(true);
            expect(result.formErrors).toEqual({});
        });

        it('should fail if the title is empty', () => {
            const result = validateModuleForm('   ', '', []);
            expect(result.isValid).toBe(false);
            expect(result.formErrors.title).toBe('Обязательное поле');
            expect(result.firstError.id).toBe('title');
        });

        it('should fail if the title is shorter than 2 characters', () => {
            const result = validateModuleForm('A', '', []);
            expect(result.isValid).toBe(false);
            expect(result.formErrors.title).toBe('Минимальная длина — 2 символа');
        });

        it('should fail if the title exceeds 70 characters', () => {
            const longTitle = 'A'.repeat(71);
            const result = validateModuleForm(longTitle, '', []);
            expect(result.isValid).toBe(false);
            expect(result.formErrors.title).toBe('Слишком длинное название');
        });

        it('should fail if the description exceeds 255 characters', () => {
            const longDescription = 'A'.repeat(256);
            const result = validateModuleForm('Valid Title', longDescription, []);
            expect(result.isValid).toBe(false);
            expect(result.formErrors.description).toBe('Слишком длинное описание');
            expect(result.firstError.id).toBe('description');
        });
    });

    describe('general question validation', () => {
        it('should fail if question text is empty', () => {
            const questions = [{id: 'q1', type: QUESTION_TYPES.INPUT, text: '   ', answers: [{content: 'Answer'}]}];
            const result = validateModuleForm('Test', '', questions);

            expect(result.isValid).toBe(false);
            expect(result.questionErrors['q1'].text).toBe('Обязательное поле');
            expect(result.firstError.type).toBe('question');
        });

        it('should fail if question text exceeds 200 characters', () => {
            const longText = 'A'.repeat(201);
            const questions = [{id: 'q1', type: QUESTION_TYPES.INPUT, text: longText, answers: [{content: 'Answer'}]}];
            const result = validateModuleForm('Test', '', questions);

            expect(result.isValid).toBe(false);
            expect(result.questionErrors['q1'].text).toBe('Слишком длинный текст вопроса');
        });
    });

    describe('INPUT type validation', () => {
        it('should fail if the answer is empty', () => {
            const questions = [{id: 'q1', type: QUESTION_TYPES.INPUT, text: 'Question text', answers: [{content: ''}]}];
            const result = validateModuleForm('Test', '', questions);

            expect(result.isValid).toBe(false);
            expect(result.questionErrors['q1'].answer).toBe('Обязательное поле');
        });

        it('should fail if the answer exceeds 150 characters', () => {
            const longAnswer = 'A'.repeat(151);
            const questions = [{
                id: 'q1',
                type: QUESTION_TYPES.INPUT,
                text: 'Question text',
                answers: [{content: longAnswer}]
            }];
            const result = validateModuleForm('Test', '', questions);

            expect(result.isValid).toBe(false);
            expect(result.questionErrors['q1'].answer).toBe('Слишком длинный ответ');
        });
    });

    describe('CHOICE type validation', () => {
        it('should fail if there are fewer than 2 options', () => {
            const questions = [{
                id: 'q1',
                type: QUESTION_TYPES.CHOICE,
                text: 'Question',
                options: [{content: 'Opt 1', isCorrect: true}]
            }];
            const result = validateModuleForm('Test', '', questions);

            expect(result.isValid).toBe(false);
            expect(result.questionErrors['q1'].optionsHelper).toContain('Добавьте минимум два варианта ответа');
        });

        it('should fail if no correct options are selected', () => {
            const questions = [{
                id: 'q1',
                type: QUESTION_TYPES.CHOICE,
                text: 'Question',
                options: [
                    {content: 'Opt 1', isCorrect: false},
                    {content: 'Opt 2', isCorrect: false}
                ]
            }];
            const result = validateModuleForm('Test', '', questions);

            expect(result.isValid).toBe(false);
            expect(result.questionErrors['q1'].optionsHelper).toContain('Отметьте хотя бы один вариант как правильный');
        });

        it('should fail if an option content is empty', () => {
            const questions = [{
                id: 'q1',
                type: QUESTION_TYPES.CHOICE,
                text: 'Question',
                options: [
                    {content: '   ', isCorrect: true},
                    {content: 'Opt 2', isCorrect: false}
                ]
            }];
            const result = validateModuleForm('Test', '', questions);

            expect(result.isValid).toBe(false);
            expect(result.questionErrors['q1'].optionContent[0].content).toBe('Введите текст');
        });

        it('should fail if an option content exceeds 100 characters', () => {
            const longOption = 'A'.repeat(101);
            const questions = [{
                id: 'q1',
                type: QUESTION_TYPES.CHOICE,
                text: 'Question',
                options: [
                    {content: longOption, isCorrect: true},
                    {content: 'Opt 2', isCorrect: false}
                ]
            }];
            const result = validateModuleForm('Test', '', questions);

            expect(result.isValid).toBe(false);
            expect(result.questionErrors['q1'].optionContent[0].content).toBe('Слишком длинный ответ');
        });
    });
});
