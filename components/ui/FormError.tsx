type TFormError = {
    formErrors: string[] | undefined;
};

function FormError({ formErrors }: TFormError) {
    return (
        <>
            {formErrors?.map((msg, index) => (
                <p key={index} className="mt-1 text-destructive">
                    {msg}
                </p>
            ))}
        </>
    );
}

export default FormError;
