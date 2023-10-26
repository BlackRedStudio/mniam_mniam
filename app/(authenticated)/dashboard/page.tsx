import ProductScanner from "@/components/ProductScanner";
import H2 from "@/components/ui/H2";
import { getServerSession } from "next-auth";

async function DashboardPage() {

    const session = await getServerSession();

    if(!session) return null;

    const userName = session.user?.name?.split(' ')[0] ?? 'Użytkowniku';

    return (
        <section className="dashboard-page">
            <H2 className="text-center mb-6">Witaj {userName},<br/>co dzisiaj smakujemy?</H2>
            <ProductScanner />
        </section>
    );
}

export default DashboardPage;
