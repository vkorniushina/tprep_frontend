import {describe, it, expect, vi} from 'vitest';
import {validateTestForm, validateFile} from './validateCreateTest.js';

vi.mock('../constants/fileUpload.js', () => ({
    ALLOWED_FILE_EXTENSIONS: ['.txt', '.pdf'],
    ALLOWED_FILE_TYPES: ['text/plain', 'application/pdf'],
    MAX_FILE_SIZE: 1024 * 1024,
    MAX_FILE_SIZE_MB: 1
}));

describe('validateCreateTest utils', () => {

    describe('validateTestForm', () => {
        it('should return isValid: true for correct data', () => {
            const result = validateTestForm('Новый тест', 'Краткое описание');
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual({});
        });

        it('should return errors for an invalid title', () => {
            expect(validateTestForm('', '').errors.name).toBe('Обязательное поле');
            expect(validateTestForm('1', '').errors.name).toBe('Минимальная длина — 2 символа');
            expect(validateTestForm('a'.repeat(75), '').errors.name).toBe('Слишком длинное название');
        });

        it('should return an error for a description that is too long', () => {
            const result = validateTestForm('Тест', 'a'.repeat(300));
            expect(result.isValid).toBe(false);
            expect(result.errors.description).toBe('Слишком длинное описание');
        });
    });

    describe('validateFile', () => {
        it('should require a file to be present', () => {
            const result = validateFile(null);
            expect(result.error).toBe('Прикрепите файл для создания теста');
        });

        it('should return an error for an invalid file type', () => {
            const invalidFile = {type: 'image/jpeg', size: 500};
            const result = validateFile(invalidFile);
            expect(result.error).toContain('Неподдерживаемый формат файла');
        });

        it('should return an error if the file size is exceeded', () => {
            const largeFile = {type: 'application/pdf', size: 2 * 1024 * 1024};
            const result = validateFile(largeFile);
            expect(result.error).toContain('Файл слишком большой');
        });

        it('should pass validation for a valid file', () => {
            const validFile = {type: 'application/pdf', size: 500 * 1024};
            const result = validateFile(validFile);
            expect(result.error).toBeNull();
        });
    });
});
