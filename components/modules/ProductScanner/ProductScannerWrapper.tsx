'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';

import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../ui/Select';
import BarcodeScanner from './BarcodeScanner';

function ProductScannerWrapper() {
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

            if (
                availableVideoDevices?.length > 0 &&
                availableVideoDevices[0]?.deviceId
            ) {
                setDevices(availableVideoDevices);
                setDeviceId(availableVideoDevices[0]?.deviceId);
            }
        };

        if (typeof navigator.mediaDevices !== 'undefined') {
            getMediaDevices();
        }
    }, []);

    return (
        <>
            <div className="mb-3 text-center">
                {devices.length > 0 && (
                    <Select
                        onValueChange={e => setDeviceId(e)}
                        value={deviceId}>
                        <SelectTrigger className="mb-5 w-full">
                            <SelectValue placeholder="Rozwiń listę" />
                        </SelectTrigger>
                        <SelectContent>
                            {devices.map((device, index) => (
                                <SelectItem
                                    key={device.deviceId}
                                    value={device.deviceId}>
                                    {device.label ||
                                        `Wejście Video nr: ${index + 1}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                {scannerEnabled && (
                    <BarcodeScanner
                        deviceId={deviceId}
                        setCode={setCode}
                        setScannerEnabled={setScannerEnabled}
                    />
                )}
                <Button onClick={() => setScannerEnabled(!scannerEnabled)}>
                    {scannerEnabled
                        ? 'Zakończ skanowanie'
                        : 'Rozpocznij skanowanie'}
                </Button>
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
                className="mt-5 w-full"
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
