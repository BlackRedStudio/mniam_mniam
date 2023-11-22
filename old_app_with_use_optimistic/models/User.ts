import Model from "../Model";
import { usersTable, TUser } from "../../server/schema";

class User extends Model<typeof usersTable._.config, TUser> {
    
    constructor() {
        super(usersTable);
    }

}

export default User;
