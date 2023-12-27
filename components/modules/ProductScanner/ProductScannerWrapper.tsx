'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useToast } from '@/lib/hooks/use-toast';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';

import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import BarcodeScanner from './BarcodeScanner';

function ProductScannerWrapper() {
    const { toast } = useToast();
    const [code, setCode] = useState('');
    const [deviceEnabled, setDeviceEnabled] = useState(false);
    const [scannerEnabled, setScannerEnabled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getMediaDevices = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { exact: 'environment' } },
                });
                setDeviceEnabled(true);
            } catch (err) {
                toast({
                    title: 'Problem z kamerą, uruchom ponownie lub przeinstaluj aplikację.',
                    variant: 'destructive',
                });
            }
        };

        if (typeof navigator.mediaDevices !== 'undefined') {
            getMediaDevices();
        }
    }, []);

    const possibleCodeLengths = [7, 8, 12, 13, 14];
    const isDisabled = possibleCodeLengths.indexOf(code.length) === -1;

    return (
        <>
            <div className="mb-3 text-center">
                {scannerEnabled && (
                    <BarcodeScanner
                        setCode={setCode}
                        setScannerEnabled={setScannerEnabled}
                    />
                )}
                {deviceEnabled ? (
                    <Button onClick={() => setScannerEnabled(!scannerEnabled)}>
                        {scannerEnabled
                            ? 'Zakończ skanowanie'
                            : 'Rozpocznij skanowanie'}
                    </Button>
                ) : (
                    <Loader className="my-4" />
                )}
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
                className="mt-1 w-full"
                disabled={isDisabled}
                variant={isDisabled ? 'default' : 'orange'}
                onClick={() => {
                    router.push(`/product/${code}`);
                }}>
                Wyszukaj produkt
            </Button>
        </>
    );
}

export default ProductScannerWrapper;
