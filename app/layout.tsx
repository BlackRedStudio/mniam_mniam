import '/global.css';

import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { getServerSession } from 'next-auth';

import { cn } from '@/lib/utils/utils';
import { Toaster } from '@/components/ui/Toaster';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
    const session = await getServerSession(authOptions);

    return (
        <html
            lang="pl"
            className={cn(
                'mx-auto max-w-screen-sm',
                session?.user.darkMode ? 'dark' : 'light',
            )}
        >
            <body
                className={cn(
                    'mx-auto min-h-screen max-w-[700px] overflow-hidden bg-background font-sans antialiased',
                    fontSans.variable,
                )}
            >
                <Providers>{children}</Providers>
                <Toaster />
            </body>
        </html>
    );
}

export default RootLayout;
