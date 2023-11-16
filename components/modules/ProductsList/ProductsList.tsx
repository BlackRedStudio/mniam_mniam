import { TGetUserProductsReturn } from '@/actions/user-product-actions';

import ProductListItem from './ProductListItem';
import { TProductListType } from '@/types/types';

type TProductsListProps = {
    userProductsList: NonNullable<TGetUserProductsReturn['userProductsList']>;
    listType: TProductListType,
};

function ProductsList({ userProductsList, listType }: TProductsListProps) {
    return (
        <div className='grid grid-cols-3 gap-2'>
            {userProductsList.map(product => (
                <ProductListItem key={product.id} listType={listType} userProduct={product} />
            ))}
        </div>
    );
}

export default ProductsList;
