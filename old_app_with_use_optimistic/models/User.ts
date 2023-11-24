import Model from "../Model";
import { usersTable, TUser } from "../../server/schemas";

class User extends Model<typeof usersTable._.config, TUser> {
    
    constructor() {
        super(usersTable);
    }

}

export default User;
