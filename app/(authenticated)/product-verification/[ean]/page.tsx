import { getProduct } from "@/actions/product-actions";
import ProductVerificationCard from "@/components/modules/ProductVerificationCard/ProductVerificationCard";
import { redirect } from "next/navigation";

type TProductVerificationItemPageProps = {
    params: {
        ean: string
    }
};

async function ProductVerificationItemPage({params: {ean}}: TProductVerificationItemPageProps) {

    const res = await getProduct(ean);

    if(!res || !res.success || !res.product) {
        redirect('/product-verification');
    }

    return (
        <section className="product-verification-item-page">
            <ProductVerificationCard product={res.product} />
        </section>
    )
}

export default ProductVerificationItemPage;
