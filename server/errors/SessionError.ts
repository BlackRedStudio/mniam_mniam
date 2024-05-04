class SessionError {
    message: string;

    constructor() {
        this.message = 'Dostęp tylko dla zalogowanych użytkowników.';
    }
}

export default SessionError;
