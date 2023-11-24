class ParsedError<T> {

    success: false;

    message: string;

    errors: T;

    constructor(errors: T) {
        this.message = 'W formularzy wystąpiły błędy, popraw je i spróbuj ponownie.';
        this.errors = errors;
    }

}

export default ParsedError;
