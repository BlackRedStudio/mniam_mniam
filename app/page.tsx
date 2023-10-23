import { Button } from "@/components/ui/button";

export default async function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4">
			Strona główna
			<Button>Zaloguj się</Button>
			<Button>Zarejestruj się</Button>
		</main>
    );
}
