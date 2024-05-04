import { cn } from '@/lib/utils/utils';

type TFormError = {
    formErrors: string[] | undefined;
    className?: string;
};

function FormError({ formErrors, className }: TFormError) {
    return (
        <>
            {formErrors?.map((msg, index) => (
                <p
                    key={index}
                    className={cn('mt-1 text-xs text-destructive', className)}
                >
                    {msg}
                </p>
            ))}
        </>
    );
}

export default FormError;
