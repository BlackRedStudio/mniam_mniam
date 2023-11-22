import { cn } from '@/lib/utils/utils';
import Image from 'next/image';

type TLoaderProps = {
    className?: string;
};

const Loader = ({ className }: TLoaderProps) => (
    <Image
        className={cn('mx-auto animate-spin', className)}
        src={'/donut.svg'}
        height={50}
        width={50}
        alt="donut"
    />
);

export default Loader;
