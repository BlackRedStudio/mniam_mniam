import { redirect } from 'next/navigation';
import { getProductAction } from '@/server/actions/product-actions';

import ProductVerificationCard from '@/components/modules/ProductVerificationCard/ProductVerificationCard';

type TProductVerificationItemPageProps = {
    params: {
        ean: string;
    };
};

async function ProductVerificationItemPage({
    params: { ean },
}: TProductVerificationItemPageProps) {
    const res = await getProductAction(ean);

    if (!res.success) {
        redirect('/product-verification');
    }

    return (
        <section>
            <ProductVerificationCard product={res.product} />
        </section>
    );
}

export default ProductVerificationItemPage;
