import H2 from '@/components/ui/H2';
import ProductsList from '@/components/modules/ProductsList/ProductsList';
import { getProducts } from '@/actions/product-actions';

async function ProductVerificationPage() {
    const res = await getProducts('draft');

    return (
        <section className="product-verification-page">
            <H2 className="text-center mb-5">
                Produkty oczekujące weryfikacji:
            </H2>
            {res?.productsList && res.productsList.length > 0 ? (
                <ProductsList productsList={res.productsList} listType='draft' />
            ) : (
                <div className="text-center text-lg">
                    Brak zapisanych produktów...
                </div>
            )}
        </section>
    );
}

export default ProductVerificationPage;
