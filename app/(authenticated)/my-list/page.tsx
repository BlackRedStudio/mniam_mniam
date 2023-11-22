import { getUserProducts } from '@/server/actions/user-product-actions';

import H2 from '@/components/ui/H2';
import ProductsList from '@/components/modules/ProductsList/ProductsList';

async function MyListPage() {
    const res = await getUserProducts(['visible', 'draftVisible']);

    return (
        <section className="my-list-page">
            <H2 className="text-center mb-3">Moja lista:</H2>
            {res.userProductsList && res.userProductsList.length > 0 ? (
                <ProductsList
                    productsList={res.userProductsList}
                    listType="active"
                />
            ) : (
                <div className="text-center text-lg">
                    Brak zapisanych produktów...
                </div>
            )}
        </section>
    );
}

export default MyListPage;
