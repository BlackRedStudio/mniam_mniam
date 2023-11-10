import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Profile from "@/components/modules/Profile/Profile";
import { db } from "@/lib/db";
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

async function profilePage() {

    const session = await getServerSession(authOptions);
    if(!session) return null;

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id)
    });
    if(!user) return null;

    return (
        <>
            <Profile user={user} />
        </>
    )
}

export default profilePage;
