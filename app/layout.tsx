import '/global.css';

import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/lib/utils/utils';
import { Toaster } from '@/components/ui/toaster';
import Providers from './providers';

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: 'Mniam Mniam',
    description: 'Food Rating App',
    applicationName: 'Mniam Mniam',
    keywords: ['mniam_mniam'],
};

type TRootLayoutProps = {
    children: ReactNode;
};

async function RootLayout({ children }: TRootLayoutProps) {
    return (
        <html lang="pl" className='max-w-screen-sm mx-auto'>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased mx-auto max-w-[700px] overflow-hidden',
                    fontSans.variable,
                )}>
                <Providers>
                    {children}
                </Providers>
                <Toaster />
            </body>
        </html>
    );
}

export default RootLayout;
