/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';

import LoginTab from '@/components/modules/LoginTab';

// Mock useRouter:
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            prefetch: () => null,
        };
    },
}));

describe('Test Login Tab', () => {
    it('Should get product by name, from API', async () => {
        render(<LoginTab />);
        const elLogin = screen.getByText('Zaloguj się');

        expect(elLogin).toBeInTheDocument();
    });
});
