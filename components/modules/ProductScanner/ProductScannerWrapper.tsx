'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import BarcodeScanner from './BarcodeScanner';
import Loader from '../../ui/Loader';

function ProductScannerWrapper() {
    const { toast } = useToast();

    const [code, setCode] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [scannerEnabled, setScannerEnabled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getMediaDevices = async () => {
            const availableDevices =
                await navigator.mediaDevices.enumerateDevices();

            const availableVideoDevices = availableDevices.filter(
                device => device.kind === 'videoinput',
            );

            if (availableVideoDevices?.length > 0) {
                setDevices(availableVideoDevices);
                setDeviceId(availableVideoDevices[0]?.deviceId);
            } else {
                toast({
                    title: 'Nie znaleziono kamery',
                    variant: 'destructive',
                });
                setDeviceId('NO_CAMERA_FOUND');
            }
        };
        getMediaDevices();
    }, []);

    return (
        <>
            <div className="text-center mb-3">
                {!deviceId && <Loader />}
                {scannerEnabled && (
                    <BarcodeScanner
                        deviceId={deviceId}
                        devices={devices}
                        setDeviceId={setDeviceId}
                        setCode={setCode}
                        setScannerEnabled={setScannerEnabled}
                    />
                )}
                {
                    deviceId === 'NO_CAMERA_FOUND' && <div className='text-destructive'>Brak kamery, odśwież aplikację, lub spróbuj na innym urządzeniu</div>
                }
                {deviceId !== 'NO_CAMERA_FOUND' && deviceId && <Button onClick={() => setScannerEnabled(!scannerEnabled)}>
                    {scannerEnabled
                        ? 'Zakończ skanowanie'
                        : 'Rozpocznij skanowanie'}
                </Button>}
            </div>
            <div className="mb-4">
                <Label htmlFor="code">
                    Zeskanowany lub wpisany ręcznie kod kreskowy
                </Label>
                <Input
                    type="number"
                    id="code"
                    name="code"
                    className="mt-1"
                    placeholder="Miejsce na kod kreskowy"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                />
            </div>
            <Button
                className="w-full mt-5"
                disabled={code.length !== 8 && code.length !== 13}
                onClick={() => {
                    router.push(`/product/${code}`);
                }}>
                Wyszukaj produkt
            </Button>
        </>
    );
}

export default ProductScannerWrapper;
