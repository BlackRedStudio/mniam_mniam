'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

import { users } from '@/types/schema';
import { db } from '@/lib/db';

// export async function addUser() {
//     try {
//         await db
//             .insert(users)
//             .values({ name: 'Dodane poprzez Server Actions' });

//         revalidatePath('/');

//         return { message: 'Nowy użytkownik utworzony' };
//     } catch (e) {
//         return { message: 'Błąd' };
//     }
// }

// export async function deleteUser() {
//     try {
//         await db
//         .delete(users)
//         .where(eq(users.name, 'Dodane poprzez Server Actions'));

//         revalidatePath('/');

//         return { message: 'Poprzedni użytkownicy usunięci' };
//     } catch (e) {
//         return { message: 'Błąd' };
//     }
// }
