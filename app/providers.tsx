'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app';
import { SessionProvider } from 'next-auth/react';

type TProviderLayoutProps = {
    children: ReactNode;
};

function Providers({ children }: TProviderLayoutProps) {
    const router = useRouter();

    useEffect(() => {
        CapacitorApp.addListener(
            'appUrlOpen',
            (event: URLOpenListenerEvent) => {
                if (event.url.indexOf('api/auth/callback') > -1) {
                    const slug =
                        event.url.split('mniam-mniam.vercel.app').pop() || '/';
                    router.push(slug);
                }
            },
        );
    }, []);

    return <SessionProvider>{children}</SessionProvider>;
}

export default Providers;
