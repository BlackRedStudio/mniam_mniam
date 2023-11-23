import Profile from "@/components/modules/Profile/Profile";
import { checkSession } from "@/server/helpers/helpers";
import UserService from "@/server/services/UserService";

async function profilePage() {

    const session = await checkSession();

    const user = await UserService.findFirstById(session.user.id);

    if(!user) return null;

    return (
        <>
            <Profile user={user} />
        </>
    )
}

export default profilePage;
