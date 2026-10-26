import React from 'react';
import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import Card from './Card.jsx';

const renderCard = (props = {}) => {
    const defaultProps = {
        id: 1,
        name: 'React test',
        description: 'Описание',
        questionsCount: 4,
        progress: 1,
        isOwner: true,
        isMenuOpen: false,
        onMenuToggle: vi.fn(),
        onDelete: vi.fn(),
    };
    const merged = {...defaultProps, ...props};

    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Card {...merged}/>}/>
                <Route path="/test/:id" element={<div>Страница теста</div>}/>
                <Route path="/test/:id/edit" element={<div>Редактирование</div>}/>
            </Routes>
        </MemoryRouter>
    );
    return merged;
};

describe('Card', () => {
    it('renders name, pluralized questions count and percent', () => {
        renderCard();

        expect(screen.getByText('React test')).toBeInTheDocument();
        expect(screen.getByText('4 вопроса')).toBeInTheDocument();
        expect(screen.getByText('25%')).toBeInTheDocument();
    });

    it('shows 0% when there are no questions', () => {
        renderCard({questionsCount: 0, progress: 0});
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('shows placeholder for empty description', () => {
        renderCard({description: ''});
        expect(screen.getByText('Здесь могло быть описание...')).toBeInTheDocument();
    });

    it('opens test page', async () => {
        const user = userEvent.setup();
        renderCard();

        await user.click(screen.getByRole('button', {name: 'Открыть тест'}));

        expect(screen.getByText('Страница теста')).toBeInTheDocument();
    });

    it('toggles menu by id', async () => {
        const user = userEvent.setup();
        const props = renderCard();

        await user.click(screen.getByRole('button', {name: 'Menu'}));

        expect(props.onMenuToggle).toHaveBeenCalledWith(1);
    });

    it('hides menu for non-owner', () => {
        renderCard({isOwner: false});
        expect(screen.queryByRole('button', {name: 'Menu'})).not.toBeInTheDocument();
    });

    it('deletes test from open menu', async () => {
        const user = userEvent.setup();
        const props = renderCard({isMenuOpen: true});

        await user.click(screen.getByRole('button', {name: 'Удалить'}));

        expect(props.onDelete).toHaveBeenCalledWith(1);
        expect(props.onMenuToggle).toHaveBeenCalledWith(null);
    });

    it('opens editor from menu', async () => {
        const user = userEvent.setup();
        renderCard({isMenuOpen: true});

        await user.click(screen.getByRole('button', {name: 'Редактировать'}));

        expect(screen.getByText('Редактирование')).toBeInTheDocument();
    });

    it('closes menu on outside click', async () => {
        const user = userEvent.setup();
        const props = renderCard({isMenuOpen: true});

        await user.click(document.body);

        expect(props.onMenuToggle).toHaveBeenCalledWith(null);
    });
});
