import { getUserProductsAction } from '@/server/actions/user-product-actions';

import H2 from '@/components/ui/H2';
import ProductsList from '@/components/modules/ProductsList/ProductsList';

async function MyListPage() {
    const res = await getUserProductsAction(['visible', 'draftVisible', 'invisible', 'draft']);

    return (
        <section>
            <H2 className="mb-3 text-center">Produkty ocenione przez Ciebie:</H2>
            {res.success ? (
                <ProductsList
                    productsList={res.userProductsList}
                    listType="active"
                />
            ) : (
                <div className="text-center text-lg">
                    Brak ocenionych produktów...
                </div>
            )}
        </section>
    );
}

export default MyListPage;
