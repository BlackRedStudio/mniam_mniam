import { eq, and } from "drizzle-orm";
import { DB } from "../helpers/DB";
import { TUserInsert, usersTable } from "../schemas";

type TFindUser = {
    id?: string,
    email?: string
}

class UserRepository {

    static async first({id, email}: TFindUser) {
        const user = await DB.query.usersTable.findFirst({
            where: and(
                id ? eq(usersTable.id, id) : undefined,
                email ? eq(usersTable.email, email) : undefined
            )
        });

        return user;
    }

    static async firstWithAccounts({id, email}: TFindUser) {
        const user = await DB.query.usersTable.findFirst({
            where: and(
                id ? eq(usersTable.id, id) : undefined,
                email ? eq(usersTable.email, email) : undefined
            ),
            with: {
                accounts: true
            }
        });

        return user;
    }

    static async insert(email: string, name: string, password: string) {

        const id = crypto.randomUUID();

        // user not exist before
        await DB.insert(usersTable).values({
            id,
            name,
            email,
            password,
        });
    }

    static async update(id: string, userValues: Omit<TUserInsert, 'id'>) {
        await DB.update(usersTable)
            .set(userValues)
            .where(eq(usersTable.id, id));
    }

    static async deleteAvatar(id: string) {
        const res = await DB.update(usersTable)
            .set({
                image: null,
            })
            .where(eq(usersTable.id, id));
        
        return res;
    }
}

export default UserRepository;
