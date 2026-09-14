import React from 'react';
import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from './Tabs.jsx';
import styles from './Tabs.module.scss';

const tabs = [
    {id: 'file', label: 'Из файла'},
    {id: 'manual', label: 'Вручную'},
];

describe('Tabs', () => {
    it('should render all tabs', () => {
        render(
            <Tabs
                tabs={tabs}
                activeTab="file"
                onChange={() => {
                }}
            />
        );

        expect(screen.getByRole('button', {name: 'Из файла'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Вручную'})).toBeInTheDocument();
    });

    it('should call onChange with clicked tab id', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();

        render(
            <Tabs
                tabs={tabs}
                activeTab="file"
                onChange={handleChange}
            />
        );

        await user.click(screen.getByRole('button', {name: 'Вручную'}));

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith('manual');
    });

    it('should apply active class to active tab', () => {
        render(
            <Tabs
                tabs={tabs}
                activeTab="manual"
                onChange={() => {
                }}
            />
        );

        expect(screen.getByRole('button', {name: 'Вручную'})).toHaveClass(styles.tabActive);
        expect(screen.getByRole('button', {name: 'Из файла'})).not.toHaveClass(styles.tabActive);
    });
});
