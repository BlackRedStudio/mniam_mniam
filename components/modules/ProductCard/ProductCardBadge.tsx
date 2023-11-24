import { TUserProductStatus } from '@/types/types';
import { Badge } from '@/components/ui/Badge';

const badgesConfig = {
    unknown: {
        variant: 'destructive' as const,
        text: 'Wystąpił nieznany błąd...',
    },
    missing: {
        variant: 'destructive' as const,
        text: 'Brakuje niektórych podstawowych cech produktu, aby prawidłowo zapisać produkt, uzupełnij cechy oznaczone na czerwono.',
    },
    firstRate: {
        variant: 'success' as const,
        text: 'Jesteś pierwszym użytkownikiem oceniającym ten produkt!',
    },
    visible: {
        variant: 'success' as const,
        text: 'Produkt znajduje się na Twojej liście!',
    },
    invisible: {
        variant: 'default' as const,
        text: 'Produktu nie ma na Twojej liście.',
    },
    draft: {
        variant: 'secondary' as const,
        text: 'Produkt jest w trakcie weryfikacji...',
    },
    draftVisible: {
        variant: 'secondary' as const,
        text: 'Produkt znajduje się na Twojej liście, ale jest jeszcze w trakcie weryfikacji...',
    },
};

type BadgeType = keyof typeof badgesConfig;

type TProductCardBadgeProps = {
    peopleRateCount: number;
    isSomethingMissing: boolean;
    status?: TUserProductStatus;
};

function ProductCardBadge({
    peopleRateCount,
    isSomethingMissing,
    status,
}: TProductCardBadgeProps) {
    let type: BadgeType = 'unknown';

    if (peopleRateCount === 0) {
        if (isSomethingMissing) {
            type = 'missing';
        } else {
            type = 'firstRate';
        }
    } else {
        type = status || 'unknown';
    }

    const { variant, text } = badgesConfig[type];

    return <Badge variant={variant}>{text}</Badge>;
}

export default ProductCardBadge;
