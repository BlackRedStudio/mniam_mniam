import H2 from "@/components/ui/H2";
import { getServerSession } from "next-auth";

async function DashboardPage() {

    const session = await getServerSession();

    if(!session) return null;

    const userName = session.user?.name?.split(' ')[0] ?? 'Użytkowniku';

    return (
        <section className="dashboard-page">
            <H2 className="text-center">Witaj {userName},<br/>co dzisiaj smakujemy?</H2>
        </section>
    );
}

export default DashboardPage;
