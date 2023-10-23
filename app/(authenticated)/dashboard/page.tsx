import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {

	// const users = await db.query.users.findMany();
    const session = await getServerSession();
    return (
        <section className="dashboard-page">
            <h1>Dashboard!!!!</h1>
        </section>
    );
}
