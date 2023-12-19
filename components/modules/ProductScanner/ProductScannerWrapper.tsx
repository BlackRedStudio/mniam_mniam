'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { switchCamera__Action } from '@/server/actions/user-actions';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';

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

type TProductScannerWrapperProps = {
    camera: number;
};

function ProductScannerWrapper({ camera }: TProductScannerWrapperProps) {
    const { update } = useSession();

    const [code, setCode] = useState('');
    const [deviceNumber, setDeviceNumber] = useState(camera);
    const [deviceId, setDeviceId] = useState('');
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [scannerEnabled, setScannerEnabled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getMediaDevices = async () => {
            await navigator.mediaDevices.getUserMedia({video: true});
            
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
                setDeviceNumber(deviceNumber || 0);
                setDeviceId(availableVideoDevices[deviceNumber || 0].deviceId);
            }
        };

        if (typeof navigator.mediaDevices !== 'undefined') {
            getMediaDevices();
        }
    }, []);

    const switchCamera = async (value: number) => {
        setDeviceNumber(value);
        setDeviceId(devices[value]?.deviceId);
        await update({
            camera: value,
        });
        await switchCamera__Action(value);
    };

    const possibleCodeLengths = [7, 8, 12, 13, 14];
    const isDisabled = possibleCodeLengths.indexOf(code.length) === -1;

    return (
        <>
            <div className="mb-3 text-center">
                {devices.length > 0 && (
                    <Select
                        onValueChange={value => switchCamera(parseInt(value))}
                        value={String(deviceNumber)}>
                        <SelectTrigger className="mb-5 w-full">
                            <SelectValue placeholder="Rozwiń listę" />
                        </SelectTrigger>
                        <SelectContent>
                            {devices.map((device, index) => {
                                return (
                                    <SelectItem
                                        key={device.deviceId}
                                        value={String(index)}>
                                        Wejście Video nr: {index + 1}
                                    </SelectItem>
                                );
                            })}
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
                {devices.length === 0 ? (
                    <Loader className="my-4" />
                ) : (
                    <Button onClick={() => setScannerEnabled(!scannerEnabled)}>
                        {scannerEnabled
                            ? 'Zakończ skanowanie'
                            : 'Rozpocznij skanowanie'}
                    </Button>
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
