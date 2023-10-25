import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type TH2Props = {
    children: ReactNode;
    className?: string;
};

const H2 = ({ children, className }: TH2Props) => (
    <h2
        className={cn(
            'scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0',
            className,
        )}>
        {children}
    </h2>
);

export default H2;
