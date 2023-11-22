/**
 * @jest-environment node
 */

import ProductService from "@/server/services/ProductService";

describe('Product Service Test', () => {
    it('Should get product by name, from API', async () => {
        const productName = 'Pilos';

        const products = await ProductService.findByName(productName);
        expect(products.length).toBeGreaterThan(0);
    });
});
