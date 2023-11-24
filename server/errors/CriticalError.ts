import AdminError from "./AdminError";
import SessionError from "./SessionError";

class CriticalError {

    success: false;

    message: string;

    errors: null;

    constructor(e: unknown) {

        if(e instanceof SessionError) {
            this.message = e.message;
        } else if(e instanceof AdminError) {
            this.message = e.message;
        } else {
            this.message = 'Błąd aplikacji skontaktuj się z administratorem.';
        }
        console.log(e);
    }
}

export default CriticalError;
