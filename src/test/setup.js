import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';

Element.prototype.scrollIntoView = vi.fn();
window.scrollTo = vi.fn();

afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
});
