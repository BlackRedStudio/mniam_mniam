import { TGetMyListReturn } from '@/actions/user-product-actions';

import { Unpacked } from '@/types/types';

type TProductListItemProps = {
    userProduct: NonNullable<Unpacked<TGetMyListReturn['userProductsList']>>;
};

function ProductListItem({ userProduct }: TProductListItemProps) {
    return <div>{userProduct.product.name}</div>;
}

export default ProductListItem;
