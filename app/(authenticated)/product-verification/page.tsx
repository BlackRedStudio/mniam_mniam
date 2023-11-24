import { getProductsAction } from '@/server/actions/product-actions';

import H2 from '@/components/ui/H2';
import ProductsList from '@/components/modules/ProductsList/ProductsList';

async function ProductVerificationPage() {
    const res = await getProductsAction('draft');

    return (
        <section>
            <H2 className="mb-5 text-center">
                Produkty oczekujące weryfikacji:
            </H2>
            {res.success ? (
                <ProductsList
                    productsList={res.productsList}
                    listType="draft"
                />
            ) : (
                <div className="text-center text-lg">
                    Brak zapisanych produktów...
                </div>
            )}
        </section>
    );
}

export default ProductVerificationPage;
