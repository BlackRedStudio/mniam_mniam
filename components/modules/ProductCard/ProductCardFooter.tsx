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
    return (
        <div className="mt-8 space-y-4">
            {loading && <Loader className="mt-4" />}
            <Button
                className="w-full"
                onClick={() => handleAddProduct('invisible')}>
                Zapisz ocenę
            </Button>
            <Button
                className="w-full"
                onClick={() => handleAddProduct('visible')}
                variant={'outline'}>
                Zapisz ocenę i dodaj do mojej listy
            </Button>
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
