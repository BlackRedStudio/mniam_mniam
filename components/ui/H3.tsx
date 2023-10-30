import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type TH3Props = {
    children: ReactNode;
    className?: string;
};

const H3 = ({ children, className }: TH3Props) => (
    <h3
        className={cn(
            'scroll-m-20 text-lg font-semibold tracking-tight',
            className,
        )}>
        {children}
    </h3>
);

export default H3;
