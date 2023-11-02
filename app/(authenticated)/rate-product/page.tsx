import ProductCard from "@/components/modules/ProductCard/ProductCard";
import { db } from "@/lib/db";

async function rateProductPage() {

    return (
        <div className="page">
            <ProductCard />
        </div>
    );
}

export default rateProductPage;
