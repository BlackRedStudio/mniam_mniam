import { Dispatch, SetStateAction } from 'react';
import { useZxing } from 'react-zxing';

import { useToast } from '@/lib/hooks/use-toast';

import { Icons } from '../Icons';

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

    const {
        ref,
        torch: { on: torchOn, off: torchOff, status: torchStatus },
    } = useZxing({
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

    let bars = [];
    const barsNumber = 10;

    for (let i = 0; i < barsNumber; i++) {
        bars.push(
            <div className="h-full border-[1px] border-dashed border-white"></div>,
        );
    }

    return (
        <div className="relative">
            <video
                className="mb-7 h-[250px] w-full rounded-3xl object-cover"
                ref={ref}
            />
            <div className="w-[100vw - 32px] absolute bottom-3 left-3 right-3 top-3 flex h-[226px] justify-around rounded-lg border-2 border-white">
                {bars}
            </div>
            <div className="absolute right-0 top-0 z-10 rounded-bl-xl bg-white p-1 text-primary">
                {torchStatus === 'off' && (
                    <Icons.flashlight className="h-8 w-8 dark:text-secondary" onClick={torchOn} />
                )}
                {torchStatus === 'on' && (
                    <Icons.flashlightOff
                        className="h-8 w-8 dark:text-secondary"
                        onClick={torchOff}
                    />
                )}
            </div>
        </div>
    );
};

export default BarcodeScanner;
