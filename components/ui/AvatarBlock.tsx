import { getNameInitials } from '@/lib/utils/utils';

import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

type TAvatarBlockProps = {
    name: string | null;
    image: string | null;
    className?: string;
};

function AvatarBlock({ name, image, className }: TAvatarBlockProps) {
    let nameInitials = 'MM';

    if (!image && name) {
        nameInitials = getNameInitials(name);
    }

    return (
        <Avatar className={className}>
            <AvatarImage src={image || ''} />
            <AvatarFallback>{!image ? nameInitials : null}</AvatarFallback>
        </Avatar>
    );
}

export default AvatarBlock;
