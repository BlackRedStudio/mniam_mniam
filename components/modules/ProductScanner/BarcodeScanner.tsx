import { Dispatch, SetStateAction } from 'react';
import { useZxing } from 'react-zxing';

import { useToast } from '@/lib/hooks/use-toast';

type TBarcodeScannerProps = {
    deviceId: string;
    setCode: Dispatch<SetStateAction<string>>;
    setScannerEnabled: Dispatch<SetStateAction<boolean>>;
};

const BarcodeScanner = ({
    deviceId,
    setCode,
    setScannerEnabled,
}: TBarcodeScannerProps) => {
    const { toast } = useToast();

    const { ref } = useZxing({
        deviceId: deviceId || undefined,
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
            <video
                className="mb-7 h-[250px] w-full rounded-3xl object-cover"
                ref={ref}
            />
        </>
    );
};

export default BarcodeScanner;
