import { ReactNode } from 'react';

import { cn } from '@/lib/utils/utils';

type TH1Props = {
    children: ReactNode;
    className?: string;
};

const H1 = ({ children, className }: TH1Props) => (
    <h1
        className={cn(
            'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-7',
            className,
        )}>
        {children}
    </h1>
);

export default H1;
