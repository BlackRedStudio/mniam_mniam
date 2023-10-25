import { Button } from '@/components/ui/button';
import { experimental_useFormStatus as useFormStatus } from 'react-dom'

function SignUpButton() {

    const { pending } = useFormStatus()

    return (
        <Button className="mt-6 py-7 w-full" disabled={pending}>
            Zarejestruj się
        </Button>
    );
}

export default SignUpButton;
