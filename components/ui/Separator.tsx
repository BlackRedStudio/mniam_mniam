'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils/utils';

import { Icons } from '../modules/Icons';

const Separator = React.forwardRef<
    React.ElementRef<typeof SeparatorPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
    (
        { className, orientation = 'horizontal', decorative = true, ...props },
        ref,
    ) => (
        <div className="relative flex items-center justify-center">
            <div className="absolute flex space-x-1.5 bg-white px-5 dark:bg-background">
                <Icons.cakeSlice className="text-destructive" />
                <Icons.lollipop className="text-blue" />
                <Icons.donut className="text-orange" />
            </div>
            <SeparatorPrimitive.Root
                ref={ref}
                decorative={decorative}
                orientation={orientation}
                className={cn(
                    'shrink-0 bg-border',
                    orientation === 'horizontal'
                        ? 'h-[1px] w-full'
                        : 'h-full w-[1px]',
                    className,
                )}
                {...props}
            />
        </div>
    ),
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
