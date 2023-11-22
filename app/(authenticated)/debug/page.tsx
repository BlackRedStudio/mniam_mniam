import User from '@/old_app_with_use_optimistic/models/User';
import Error from '@/server/errors/Error';

export default async function DebugPage() {

    // const user = await new User().find('0d2967b8-ff7c-471a-ab61-8595fc644f7e');

    // user.data.name = 'Black Red Studio';

    // await user.save();

    console.log(new Error('Nie znaleziono produktów'));

    return <>asdasdasd</>;
}
