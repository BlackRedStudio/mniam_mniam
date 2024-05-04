class AdminError {
    message: string;

    constructor() {
        this.message = 'Dostęp tylko dla administratora.';
    }
}

export default AdminError;
