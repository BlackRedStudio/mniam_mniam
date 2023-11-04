import { getProduct } from "@/actions/product-actions";
import ProductCard from "@/components/modules/ProductCard/ProductCard";
import { redirect } from "next/navigation";

type TRateProductPage = {
    params: {
        ean: string
    }
}

async function rateProductPage({params}: TRateProductPage) {

    const res = await getProduct(params.ean);

    if(!res || !res.success || !res.product) {
        redirect('/dashboard');
    }

    return (
        <div className="page">
            <ProductCard product={res.product} userProduct={res.existingProduct?.userProducts[0]} />
        </div>
    );
}

export default rateProductPage;
