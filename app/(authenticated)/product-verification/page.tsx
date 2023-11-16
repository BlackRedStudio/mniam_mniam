import { getUserProducts } from '@/actions/user-product-actions';

import H2 from '@/components/ui/H2';
import ProductsList from '@/components/modules/ProductsList/ProductsList';

async function ProductVerificationPage() {
    const res = await getUserProducts(['draft', 'draftVisible']);

    return (
        <section className="product-verification-page">
            <H2 className="text-center mb-5">
                Produkty oczekujące weryfikacji:
            </H2>
            {res.userProductsList && res.userProductsList.length > 0 ? (
                <ProductsList userProductsList={res.userProductsList} listType='verification' />
            ) : (
                <div className="text-center text-lg">
                    Brak zapisanych produktów...
                </div>
            )}
        </section>
    );
}

export default ProductVerificationPage;
