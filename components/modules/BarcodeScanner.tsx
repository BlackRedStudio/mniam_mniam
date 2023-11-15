import { Dispatch, SetStateAction } from 'react';
import { useZxing } from 'react-zxing';


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { useToast } from '@/hooks/use-toast';

type TBarcodeScannerProps = {
    deviceId: string;
    devices: MediaDeviceInfo[];
    setCode: Dispatch<SetStateAction<string>>;
    setDeviceId: Dispatch<SetStateAction<string>>;
    setScannerEnabled: Dispatch<SetStateAction<boolean>>;
};

const BarcodeScanner = ({ deviceId, devices, setCode, setDeviceId, setScannerEnabled }: TBarcodeScannerProps) => {
    
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
                    <SelectTrigger className="w-full mb-5">
                        <SelectValue placeholder="Rozwiń listę" />
                    </SelectTrigger>
                    <SelectContent>
                        {devices.map((device, index) => (
                            <SelectItem
                                key={device.deviceId}
                                value={device.deviceId}>
                                {device.label || `Wejście Video nr: ${index + 1}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            <video className="rounded-3xl h-[250px] w-full object-cover mb-7" ref={ref} />
        </>
    );
};

export default BarcodeScanner;
