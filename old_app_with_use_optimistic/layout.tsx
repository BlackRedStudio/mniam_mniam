import '/global.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Mniam Mniam',
    description: 'Food Rating App',
    twitter: {
        card: 'summary_large_image',
        creator: '@imamdev_',
        images: 'https://example.com/og.png',
    },
    applicationName: 'Mniam Mniam',
    appleWebApp: {
        capable: true,
        title: 'Mniam Mniam',
        statusBarStyle: 'default',
    },
    formatDetection: {
        telephone: false,
    },
    themeColor: '#FFFFFF',
    viewport:
        'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
    manifest: '/manifest.json',
    icons: [
        { rel: 'apple-touch-icon', url: '/icons/apple-touch-icon.png' },
        { rel: 'shortcut icon', url: '/favicon.ico' },
    ],
    keywords: ['nextjs', 'pwa', 'next-pwa'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
					{children}
			</body>
        </html>
    );
}
