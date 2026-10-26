import React from 'react';
import {describe, it, expect, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import TestState from './TestState.jsx';

const renderWithRouter = (type, message) => {
    return render(
        <MemoryRouter initialEntries={['/test/42/quiz']}>
            <Routes>
                <Route
                    path="/test/:id/quiz"
                    element={<TestState type={type} message={message}/>}
                />
                <Route
                    path="/test/:id"
                    element={<div>Страница теста</div>}
                />
            </Routes>
        </MemoryRouter>
    );
};

describe('TestState', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('should render loading state with default loading message', () => {
        renderWithRouter('loading');

        expect(screen.getByText('Загрузка...')).toBeInTheDocument();
        expect(screen.getByText('Загрузка данных теста...')).toBeInTheDocument();
    });

    it('should render error state with provided message', () => {
        renderWithRouter('error', 'Не удалось загрузить тест');

        expect(screen.getByText('Ошибка')).toBeInTheDocument();
        expect(screen.getByText('Не удалось загрузить тест')).toBeInTheDocument();
    });

    it('should render default error message when message is not provided', () => {
        renderWithRouter('error');

        expect(screen.getByText('Ошибка')).toBeInTheDocument();
        expect(screen.getByText('Тест не найден')).toBeInTheDocument();
    });

    it('should remove quiz state from sessionStorage and navigate back to test page', async () => {
        const user = userEvent.setup();

        sessionStorage.setItem('quizState_42', 'saved state');

        const {container} = renderWithRouter('error');

        const backIcon = container.querySelector('img');

        await user.click(backIcon);

        expect(sessionStorage.getItem('quizState_42')).toBeNull();
        expect(screen.getByText('Страница теста')).toBeInTheDocument();
    });
});
