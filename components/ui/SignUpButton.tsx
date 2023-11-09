import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

type TSignUpButtonProps = {
    title: string;
};

function SignUpButton({ title }: TSignUpButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button className="mt-6 py-7 w-full" disabled={pending}>
            {title}
        </Button>
    );
}

export default SignUpButton;
