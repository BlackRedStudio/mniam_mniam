import '/global.css';

import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: 'Mniam Mniam',
    description: 'Food Rating App',
    applicationName: 'Mniam Mniam',
    themeColor: '#FFFFFF',
    viewport:
        'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
    keywords: ['mniam_mniam'],
};

type TRootLayoutProps = {
    children: ReactNode;
};

export default function RootLayout({ children }: TRootLayoutProps) {
    return (
        <html lang="pl">
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable,
                )}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
