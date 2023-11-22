import { getProductAction } from "@/server/actions/product-actions";
import ProductVerificationCard from "@/components/modules/ProductVerificationCard/ProductVerificationCard";
import CriticalError from "@/server/errors/CriticalError";
import Error from "@/server/errors/Error";
import { redirect } from "next/navigation";

type TProductVerificationItemPageProps = {
    params: {
        ean: string
    }
};

async function ProductVerificationItemPage({params: {ean}}: TProductVerificationItemPageProps) {

    const res = await getProductAction(ean);

    if(res instanceof Error || res instanceof CriticalError) {
        redirect('/product-verification');
    }

    return (
        <section className="product-verification-item-page">
            <ProductVerificationCard product={res.product} />
        </section>
    )
}

export default ProductVerificationItemPage;
