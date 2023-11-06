import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProductScanner from "@/components/modules/ProductScanner";
import ProductSearch from "@/components/modules/ProductSearch/ProductSearch";
import H2 from "@/components/ui/H2";
import { Separator } from "@/components/ui/separator";
import { getServerSession } from "next-auth";

async function DashboardPage() {

    const session = await getServerSession(authOptions);

    if(!session) return null;

    const userName = session.user?.name?.split(' ')[0] ?? 'Użytkowniku';

    return (
        <section className="dashboard-page">
            <H2 className="text-center mb-6">Witaj {userName},<br/>co dzisiaj smakujemy?</H2>
            <ProductScanner />
            <Separator className="my-8" />
            <ProductSearch />
        </section>
    );
}

export default DashboardPage;
