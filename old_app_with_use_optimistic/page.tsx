import Link from "next/link";
import { db } from "@/lib/db";
import UserList from "./UserList";

export default async function Home() {

	const users = await db.query.users.findMany();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <section>
                Witamy w <strong>Mniam Mniam</strong> Project!
				<UserList users={users} />
				<Link href={'/tescik'}>Wejdz</Link>
            </section>
        </main>
    );
}
