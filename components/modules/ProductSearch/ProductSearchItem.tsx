import Image from 'next/image';
import Link from 'next/link';

import { TOpenFoodFactsProduct } from '@/types/types';

type TProductSearchItem = {
    product: NonNullable<TOpenFoodFactsProduct>;
};

function ProductSearchItem({
    product: { _id, image_small_url, image_url, product_name, quantity },
}: TProductSearchItem) {
    let img = null;

    if (image_small_url) {
        img = (
            <Image
                src={image_small_url}
                loading="eager"
                className="mr-4 object-contain"
                width={100}
                height={100}
                alt={product_name || ''}
            />
        );
    } else if (image_url) {
        img = (
            <Image
                src={image_url}
                loading="eager"
                className="mr-4 object-contain"
                width={100}
                height={100}
                alt={product_name || ''}
            />
        );
    } else {
        img = <div className="text-destructive">Brak obrazka</div>;
    }

    return (
        <Link href={`/product/${_id}`}>
            <div className="p-5 flex hover:bg-secondary">
                {img}
                <div>
                    <strong>{product_name}</strong>
                    <br />
                    <small className="w-full">({quantity})</small>
                    <br />
                    <small className="w-full">({_id})</small>
                </div>
            </div>
        </Link>
    );
}

export default ProductSearchItem;
