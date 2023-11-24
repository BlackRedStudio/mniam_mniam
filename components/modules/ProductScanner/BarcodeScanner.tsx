import { Dispatch, SetStateAction } from 'react';
import { useZxing } from 'react-zxing';

import { useToast } from '@/lib/hooks/use-toast';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../ui/Select';

type TBarcodeScannerProps = {
    deviceId: string;
    devices: MediaDeviceInfo[];
    setCode: Dispatch<SetStateAction<string>>;
    setDeviceId: Dispatch<SetStateAction<string>>;
    setScannerEnabled: Dispatch<SetStateAction<boolean>>;
};

const BarcodeScanner = ({
    deviceId,
    devices,
    setCode,
    setDeviceId,
    setScannerEnabled,
}: TBarcodeScannerProps) => {
    const { toast } = useToast();

    const { ref } = useZxing({
        deviceId,
        onDecodeResult(result) {
            setCode(result.getText());
            setScannerEnabled(false);
            toast({
                title: 'Kod wczytany poprawnie',
                variant: 'success',
            });
        },
    });

    return (
        <>
            {devices.length > 0 && (
                <Select onValueChange={e => setDeviceId(e)} value={deviceId}>
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
            <video
                className="mb-7 h-[250px] w-full rounded-3xl object-cover"
                ref={ref}
            />
        </>
    );
};

export default BarcodeScanner;
