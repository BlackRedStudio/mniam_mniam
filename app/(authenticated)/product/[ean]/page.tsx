import { redirect } from 'next/navigation';
import { getProductAction } from '@/server/actions/product-actions';

import ProductCard from '@/components/modules/ProductCard/ProductCard';

type TProductPageProps = {
    params: {
        ean: string;
    };
};

async function ProductPage({ params: { ean } }: TProductPageProps) {
    if (ean.length !== 13 && ean.length !== 8) {
        redirect('/dashboard');
    }

    const res = await getProductAction(ean);
    if (!res.success) {
        const virtualProduct = {
            _id: ean,
        };
        const virtualStatistics = {
            averageRating: 'Brak',
            averagePrice: 'Brak',
            peopleCount: 0,
        };

        return (
            <section>
                <ProductCard
                    product={virtualProduct}
                    currentUserProduct={null}
                    productStatistics={virtualStatistics}
                />
            </section>
        );
    }

    return (
        <section>
            <ProductCard
                product={res.product}
                currentUserProduct={res.currentUserProduct}
                productStatistics={res.productStatistics}
            />
        </section>
    );
}

export default ProductPage;
