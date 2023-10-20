'use client'

import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { User } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";

export default function Home() {

	const {data: users} = useQuery<User[]>({
		queryKey: ['users'],
		queryFn: async () => {
			const res = await axios.get('users');
			return res.data.result;
		}
	});
	
	const addUser = () => {
		console.log('test');
	}

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <section>
                Witamy w <strong>Mniam Mniam</strong> Project!
				<Button className="block mt-3" onClick={() => addUser()}>Utwórz użytkownika test</Button>
				{
					users?.map(user => <h3 key={user.id}>{user.name}</h3>)
				}
            </section>
        </main>
    );
}
