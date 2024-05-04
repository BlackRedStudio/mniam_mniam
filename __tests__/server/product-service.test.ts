/**
 * @jest-environment node
 */

import ProductRepository from '@/server/repositories/ProductRepository';

describe('Product Service Test', () => {
    it('Should get product by name, from API', async () => {
        const productName = 'Pilos';

        const products = await ProductRepository.searchByName(productName);
        expect(products.length).toBeGreaterThan(0);
    });
});
