import React from 'react';
import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import ProgressBar from './ProgressBar.jsx';

describe('ProgressBar', () => {
    it('should render fraction text by default', () => {
        render(
            <ProgressBar
                value={3}
                total={10}
            />
        );

        expect(screen.getByText('3 / 10')).toBeInTheDocument();
    });

    it('should render percent text when variant is percent', () => {
        render(
            <ProgressBar
                value={3}
                total={10}
                variant="percent"
            />
        );

        expect(screen.getByText('30%')).toBeInTheDocument();
    });

    it('should render 0 percent when total is 0', () => {
        render(
            <ProgressBar
                value={0}
                total={0}
                variant="percent"
            />
        );

        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should set fill width according to calculated percent', () => {
        const {container} = render(
            <ProgressBar
                value={5}
                total={20}
                variant="percent"
            />
        );

        const fill = container.querySelector('[style]');

        expect(fill).toHaveStyle({width: '25%'});
    });

    it('should round calculated percent', () => {
        render(
            <ProgressBar
                value={1}
                total={3}
                variant="percent"
            />
        );

        expect(screen.getByText('33%')).toBeInTheDocument();
    });
});
