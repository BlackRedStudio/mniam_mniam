'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app';
import { SessionProvider } from 'next-auth/react';
import CameraContext from '@/lib/context/CameraContext';

type TProviderLayoutProps = {
    children: ReactNode;
};

function Providers({ children }: TProviderLayoutProps) {
    const router = useRouter();
    
    const [camera, setCamera] = useState(0);

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

    return <SessionProvider>
        <CameraContext.Provider value={{camera, setCamera}}>
        {children}
        </CameraContext.Provider>
    </SessionProvider>;
}

export default Providers;
