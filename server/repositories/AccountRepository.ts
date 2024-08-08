import { DB } from '../helpers/DB';
import { TAccountInsert, accountsTable } from '../schemas';

class AccountRepository {
    static async insertRaw(account: TAccountInsert) {
        await DB.insert(accountsTable).values(account);
    }
}

export default AccountRepository;
