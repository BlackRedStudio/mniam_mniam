class Error {

    success: false;

    message: string;

    errors: null;

    constructor(message: string) {
        this.message = message;
    }
}

export default Error;
