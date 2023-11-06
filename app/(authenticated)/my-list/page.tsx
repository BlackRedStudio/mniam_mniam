import { getMyList } from "@/actions/user-product-actions";
import ProductsList from "@/components/modules/ProductsList/ProductsList";
import H3 from "@/components/ui/H3";

async function MyListPage() {

    const res = await getMyList();
    
    return (
        <section className="my-list-page">
            <H3>Moja lista:</H3>
            {
                res.userProductsList && res.userProductsList.length > 0 ?
                <ProductsList userProductsList={res.userProductsList} />
                : <div className="text-center text-lg">Brak zapisanych produktów...</div>
            }
        </section>
    )
}

export default MyListPage;
