import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

type TSignUpButtonProps = {
    title: string;
};

function SignUpButton({ title }: TSignUpButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button className="mt-6 w-full py-7" disabled={pending}>
            {title}
        </Button>
    );
}

export default SignUpButton;
