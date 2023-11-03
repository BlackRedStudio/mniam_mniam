import { getProduct } from "@/actions/product-actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProductCard from "@/components/modules/ProductCard/ProductCard";
import { db } from "@/lib/db";
import { getProductsByBarcode } from "@/lib/open-food-api";
import { products, userProducts } from "@/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

type TRateProductPage = {
    params: {
        ean: string
    }
}

async function rateProductPage({params}: TRateProductPage) {

    const session = await getServerSession(authOptions);

    if(!session) return null;

    let finalProduct = null;

    const existingProduct = await db.query.products.findFirst({
        where: eq(products.ean, params.ean),
        with: {
            userProducts: {
                limit: 1,
                where: eq(userProducts.userId, session.user.id)
            }
        }
    })

    if(existingProduct) {
        finalProduct = {
            _id: existingProduct.ean,
            brands: existingProduct.brand,
            product_name: existingProduct.name,
            image_url: existingProduct.img,
        }
    } else {
        finalProduct = await getProductsByBarcode(params.ean);
    }

    return (
        <div className="page">
            <ProductCard product={finalProduct} userProduct={existingProduct?.userProducts[0]} />
        </div>
    );
}

export default rateProductPage;
