import { getProductsByBarcode } from "@/lib/open-food-api";

export default async function DebugPage() {

    const ean = '5900352007151';
    const p = await getProductsByBarcode(ean);
    console.log(p);
    
    return <>asdasdasd</>;
}
