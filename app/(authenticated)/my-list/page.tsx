import { getMyList } from "@/actions/user-product-actions";
import ProductsList from "@/components/modules/ProductsList/ProductsList";
import H2 from "@/components/ui/H2";

async function MyListPage() {

    const res = await getMyList();
    
    return (
        <section className="my-list-page">
            <H2 className="text-center mb-5">Moja lista:</H2>
            {
                res.userProductsList && res.userProductsList.length > 0 ?
                <ProductsList userProductsList={res.userProductsList} />
                : <div className="text-center text-lg">Brak zapisanych produktów...</div>
            }
        </section>
    )
}

export default MyListPage;
