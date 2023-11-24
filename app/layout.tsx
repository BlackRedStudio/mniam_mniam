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
        <html lang="pl" className="mx-auto max-w-screen-sm">
            <body
                className={cn(
                    'mx-auto min-h-screen max-w-[700px] overflow-hidden bg-background font-sans antialiased',
                    fontSans.variable,
                )}>
                <Providers>{children}</Providers>
                <Toaster />
            </body>
        </html>
    );
}

export default RootLayout;
