'use client'

import { Button } from "@/components/ui/button";
import { getProductsByBarcode } from "@/lib/open-food-api";

function ProductTest() {
    return (
        <>
            <Button onClick={async () => {
                const product = await getProductsByBarcode(3017620422003);
                console.log(product);
            }}>Test</Button>
        </>
    )
}

export default ProductTest;
