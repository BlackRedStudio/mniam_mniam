// 'use client'

// import { addUser, deleteUser } from '@/actions/_old_user-actions';
// import { Button } from '@/components/ui/button';
// import { useTransition } from 'react';
// import { optimisticUsersAction } from './UserList';

// type TAddUserProps = {
//     handleOptimisticUsers: (action: optimisticUsersAction) => void
// }

// function AddUser({
//     handleOptimisticUsers
// }: TAddUserProps) {

//     const [isPending, startTransition] = useTransition();

//     const addNewUser = async() => {
//         handleOptimisticUsers({
//             type: 'append',
//             user: {
//                 id: Math.random(),
//                 name: 'Dodane poprzez Server Actions',
//             }
//         });
//         const res = await addUser();
//     }

//     const deletePrevUsers = async() => {
//         handleOptimisticUsers({
//             type: 'delete',
//         })
//         const res = await deleteUser();
//     }

//     return (
//         <>
//             <Button disabled={isPending} className="block mt-3" onClick={() => startTransition(addNewUser)}>
//                 Utwórz użytkownika test
//             </Button>
//             <Button disabled={isPending} className="block mt-3" onClick={() => startTransition(deletePrevUsers)}>
//                 delete last user
//             </Button>
//         </>
//     );
// }

// export default AddUser;
