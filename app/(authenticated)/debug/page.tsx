import { uploadProductPhoto } from '@/controllers/product-controller';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { userProductSchema } from '@/validation/user-product-validation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Upload() {

    const session = await getServerSession(authOptions);

    // const test = userProductSchema.safeParse({
    //     rating: 2,
    //     price: '1301.24',
    //     category: 'jelly',
    //     status: 'visible'
    // });
    // console.log(test);

    return (
        <>
           adsasd
        </>
    );
}
