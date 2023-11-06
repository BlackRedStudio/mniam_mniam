import { TGetMyListReturn } from '@/actions/user-product-actions';

import ProductListItem from './ProductListItem';

type TProductsListProps = {
    userProductsList: NonNullable<TGetMyListReturn['userProductsList']>;
};

function ProductsList({ userProductsList }: TProductsListProps) {
    return (
        <div>
            {userProductsList.map(product => (
                <ProductListItem key={product.id} userProduct={product} />
            ))}
        </div>
    );
}

export default ProductsList;
