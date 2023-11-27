import { TUserProduct } from '@/server/schemas';

import { Button } from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';

type TProductCardFooterProps = {
    loading: boolean;
    handleAddProduct: (
        status: 'visible' | 'invisible',
    ) => Promise<null | undefined>;
    handleDeleteProductFromList: () => Promise<false | undefined>;
    currentUserProduct: TUserProduct | undefined | null;
};

function ProductCardFooter({
    loading,
    handleAddProduct,
    handleDeleteProductFromList,
    currentUserProduct,
}: TProductCardFooterProps) {
    let prevStatus: 'visible' | 'invisible' = 'invisible';

    if (
        currentUserProduct?.status === 'visible' ||
        currentUserProduct?.status === 'draftVisible'
    ) {
        prevStatus = 'visible';
    }

    return (
        <div className="mt-8 space-y-4">
            {loading && <Loader className="mt-4" />}
            <Button
                className="w-full"
                onClick={() => handleAddProduct(prevStatus)}>
                Zapisz ocenę
            </Button>
            {!currentUserProduct ||
            currentUserProduct?.status === 'invisible' ||
            currentUserProduct?.status === 'draft' ? (
                <Button
                    className="w-full"
                    onClick={() => handleAddProduct('visible')}
                    variant={'orange'}>
                    Zapisz ocenę i dodaj do mojej listy
                </Button>
            ) : null}
            {currentUserProduct?.status === 'visible' ||
            currentUserProduct?.status === 'draftVisible' ? (
                <Button
                    className="w-full"
                    onClick={() => handleDeleteProductFromList()}
                    variant={'destructive'}>
                    Usuń produkt z mojej listy
                </Button>
            ) : null}
        </div>
    );
}

export default ProductCardFooter;
