import { getProduct } from "@/actions/product-actions";
import ProductCard from "@/components/modules/ProductCard/ProductCard";
import { redirect } from "next/navigation";

type TProductPageProps = {
    params: {
        ean: string
    }
}

async function ProductPage({params: {ean}}: TProductPageProps) {

    if(ean.length !== 13 && ean.length !== 8) {
        redirect('/dashboard');
    }

    const res = await getProduct(ean);
    if(!res || !res.success || !res.product) {

        const virtualProduct = {
            _id: ean
        }
        const virtualStatistics = {
            averageRating: 'Brak',
            averagePrice: 'Brak',
            peopleRateCount: 0,
        }

        return (
            <section className="product-page">
                <ProductCard product={virtualProduct} currentUserProduct={null} productStatistics={virtualStatistics} />
            </section>
        );
    }
    
    return (
        <section className="product-page">
            <ProductCard product={res.product} currentUserProduct={res.currentUserProduct} productStatistics={res.productStatistics} />
        </section>
    );
}

export default ProductPage;
