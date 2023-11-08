/**
 * @jest-environment node
 */

import { searchProductByName, searchProductByNameExtended } from '@/actions/product-actions';

describe('Product Actions Test', () => {
    it('Should get product by name, from API', async () => {
        const productName = 'Nutella';
        
        const res = await searchProductByNameExtended(productName);

        expect(res.products?.length).toBeGreaterThan(0);
        expect(res.message).toBe('Pobrano produkt.');
    });

    it('Should get product by name, from API / DB', async () => {
        const productName = 'Nutella';
        
        const res = await searchProductByName(productName);

        expect(res.products?.length).toBeGreaterThan(0);
        expect(res.message).toBe('Pobrano produkt.');
    });
});
