import { TGetMyListReturn } from '@/actions/user-product-actions';

import ProductListItem from './ProductListItem';

type TProductsListProps = {
    userProductsList: NonNullable<TGetMyListReturn['userProductsList']>;
};

function ProductsList({ userProductsList }: TProductsListProps) {
    return (
        <div className='grid grid-cols-3 gap-2'>
            {userProductsList.map(product => (
                <ProductListItem key={product.id} userProduct={product} />
            ))}
        </div>
    );
}

export default ProductsList;
