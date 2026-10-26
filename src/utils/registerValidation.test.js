import {describe, it, expect} from 'vitest';
import {
    validateName,
    validateEmail,
    validatePasswordConfirm,
    validatePasswordEmpty,
    validateTerms,
    checkPasswordStrength
} from './registerValidation.js';
import {VALIDATION_MESSAGES} from '../constants/validationMessages.js';
import {PASSWORD_STRENGTH} from '../constants/passwordStrength.js';

describe('registerValidation utility', () => {
    describe('validateName', () => {
        it('should return an empty string for a valid name', () => {
            expect(validateName('Veronika')).toBe('');
        });

        it('should return NAME_LENGTH error for names shorter than 3 characters', () => {
            expect(validateName('Ab')).toBe(VALIDATION_MESSAGES.NAME_LENGTH);
        });

        it('should return NAME_LENGTH error for names longer than 20 characters', () => {
            expect(validateName('VeryLongNameExceedingLimit')).toBe(VALIDATION_MESSAGES.NAME_LENGTH);
        });

        it('should return NAME_START error if name starts with a number', () => {
            expect(validateName('1Veronika')).toBe(VALIDATION_MESSAGES.NAME_START);
        });

        it('should return NAME_CHARS error for invalid special characters', () => {
            expect(validateName('Veronika?')).toBe(VALIDATION_MESSAGES.NAME_CHARS);
        });

        it('should return REQUIRED message if name is empty', () => {
            expect(validateName('', true)).toBe(VALIDATION_MESSAGES.REQUIRED);
        });
    });

    describe('validateEmail', () => {
        it('should return an empty string for valid email addresses', () => {
            expect(validateEmail('user@test.com')).toBe('');
        });

        it('should return EMAIL_INVALID error for invalid email formats', () => {
            expect(validateEmail('invalid-email')).toBe(VALIDATION_MESSAGES.EMAIL_INVALID);
            expect(validateEmail('user@')).toBe(VALIDATION_MESSAGES.EMAIL_INVALID);
        });

        it('should return REQUIRED message if email is empty', () => {
            expect(validateEmail('', true)).toBe(VALIDATION_MESSAGES.REQUIRED);
        });
    });

    describe('validatePasswordEmpty', () => {
        it('should return REQUIRED message if password is empty', () => {
            expect(validatePasswordEmpty('')).toBe(VALIDATION_MESSAGES.REQUIRED);
        });

        it('should return an empty string if password is provided', () => {
            expect(validatePasswordEmpty('pass123')).toBe('');
        });
    });

    describe('validatePasswordConfirm', () => {
        it('should return an empty string when passwords match', () => {
            expect(validatePasswordConfirm('password123', 'password123', true)).toBe('');
        });

        it('should return PASSWORDS_MISMATCH error when passwords do not match', () => {
            expect(validatePasswordConfirm('password123', 'different', true)).toBe(VALIDATION_MESSAGES.PASSWORDS_MISMATCH);
        });

        it('should return REQUIRED message if checkEmpty is true and confirm value is empty', () => {
            expect(validatePasswordConfirm('', 'password123', true)).toBe(VALIDATION_MESSAGES.REQUIRED);
        });
    });

    describe('validateTerms', () => {
        it('should return an empty string when terms are accepted', () => {
            expect(validateTerms(true)).toBe('');
        });

        it('should return TERMS_REQUIRED when terms are not accepted', () => {
            expect(validateTerms(false)).toBe(VALIDATION_MESSAGES.TERMS_REQUIRED);
        });
    });

    describe('checkPasswordStrength', () => {
        it('should return WEAK strength and length hint for short passwords', () => {
            const result = checkPasswordStrength('Short1!', 'Veronika', 'v@test.com');
            expect(result.strength).toBe(PASSWORD_STRENGTH.WEAK);
            expect(result.hint).toBe(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH);
        });

        it('should return WEAK strength if password matches the name', () => {
            const result = checkPasswordStrength('Veronika', 'Veronika', 'v@test.com');
            expect(result.strength).toBe(PASSWORD_STRENGTH.WEAK);
            expect(result.hint).toBe(VALIDATION_MESSAGES.PASSWORD_NAME_MATCH);
        });

        it('should return MEDIUM strength if special characters are missing', () => {
            const result = checkPasswordStrength('GoodPassword123', 'Veronika', 'v@test.com');
            expect(result.strength).toBe(PASSWORD_STRENGTH.MEDIUM);
            expect(result.hint).toBe(VALIDATION_MESSAGES.PASSWORD_ADD_SPECIAL);
        });

        it('should return STRONG strength for a fully compliant password', () => {
            const result = checkPasswordStrength('Super$ecret5198', 'Veronika', 'v@test.com');
            expect(result.strength).toBe(PASSWORD_STRENGTH.STRONG);
            expect(result.hint).toBe(VALIDATION_MESSAGES.PASSWORD_STRONG);
        });
    });
});
