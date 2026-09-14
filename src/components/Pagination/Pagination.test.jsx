import React from 'react';
import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination.jsx';

describe('Pagination', () => {
    it('should render nothing when totalPages is 1', () => {
        const {container} = render(
            <Pagination
                page={0}
                totalPages={1}
                onPageChange={() => {
                }}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('should render page buttons when totalPages is greater than 1', () => {
        render(
            <Pagination
                page={0}
                totalPages={3}
                onPageChange={() => {
                }}
            />
        );

        expect(screen.getByRole('button', {name: '1'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: '2'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: '3'})).toBeInTheDocument();
    });

    it('should disable previous button on first page', () => {
        render(
            <Pagination
                page={0}
                totalPages={3}
                onPageChange={() => {
                }}
            />
        );

        expect(screen.getByRole('button', {name: /previous/i})).toBeDisabled();
    });

    it('should disable next button on last page', () => {
        render(
            <Pagination
                page={2}
                totalPages={3}
                onPageChange={() => {
                }}
            />
        );

        expect(screen.getByRole('button', {name: /next/i})).toBeDisabled();
    });

    it('should call onPageChange with selected page index when page button is clicked', async () => {
        const user = userEvent.setup();
        const handlePageChange = vi.fn();

        render(
            <Pagination
                page={0}
                totalPages={3}
                onPageChange={handlePageChange}
            />
        );

        await user.click(screen.getByRole('button', {name: '3'}));

        expect(handlePageChange).toHaveBeenCalledTimes(1);
        expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange with next page index when next button is clicked', async () => {
        const user = userEvent.setup();
        const handlePageChange = vi.fn();

        render(
            <Pagination
                page={1}
                totalPages={4}
                onPageChange={handlePageChange}
            />
        );

        await user.click(screen.getByRole('button', {name: /next/i}));

        expect(handlePageChange).toHaveBeenCalledTimes(1);
        expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it('should call onPageChange with previous page index when previous button is clicked', async () => {
        const user = userEvent.setup();
        const handlePageChange = vi.fn();

        render(
            <Pagination
                page={2}
                totalPages={4}
                onPageChange={handlePageChange}
            />
        );

        await user.click(screen.getByRole('button', {name: /previous/i}));

        expect(handlePageChange).toHaveBeenCalledTimes(1);
        expect(handlePageChange).toHaveBeenCalledWith(1);
    });

    it('should render dots when totalPages is greater than 5', () => {
        render(
            <Pagination
                page={3}
                totalPages={10}
                onPageChange={() => {
                }}
            />
        );

        expect(screen.getAllByText('…')).toHaveLength(2);
    });
});

it('should apply active class to current page button', () => {
    render(
        <Pagination
            page={1}
            totalPages={5}
            onPageChange={() => {
            }}
        />
    );

    const activeBtn = screen.getByRole('button', {name: '2'});
    const inactiveBtn = screen.getByRole('button', {name: '1'});

    expect(activeBtn.className).toContain('active');
    expect(inactiveBtn.className).not.toContain('active');
});
