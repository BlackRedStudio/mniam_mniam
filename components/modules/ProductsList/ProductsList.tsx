import { TGetProductsReturn } from '@/actions/product-actions';
import { TGetUserProductsReturn } from '@/actions/user-product-actions';

import ProductListItem from './ProductListItem';
import ProductListItemDraft from './ProductListItemDraft';

type TActiveList = {
    productsList: NonNullable<TGetUserProductsReturn['userProductsList']>;
    listType: 'active',
}
type TDraftList = {
    productsList: NonNullable<TGetProductsReturn['productsList']>;
    listType: 'draft',
}

type TProductsListProps = TActiveList | TDraftList;

function ProductsList({ productsList, listType }: TProductsListProps) {

    let list = null

    if(listType === 'active') {
        list = productsList.map(product => (
            <ProductListItem key={product.id} userProduct={product} />
        ))
    } else {
        list = productsList.map(product => (
            <ProductListItemDraft key={product.id} product={product} />
        ))
    }

    return (
        <div className='grid grid-cols-3 gap-2'>
            {list}
        </div>
    );
}

export default ProductsList;
