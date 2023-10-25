// 'use client';

// import { useOptimistic } from 'react';

// import { TUser } from '@/types/schema';

// import AddUser from './AddUser';

// type TUserListProps = {
//     users: TUser[];
// };

// export type optimisticUsersAction = {
//     type: string;
//     user?: TUser;
// };

// function UserList({ users }: TUserListProps) {
//     const [optimisticUsers, handleOptimisticUsers] = useOptimistic(
//         users,
//         (state, action: optimisticUsersAction) => {
//             if (action.type === 'append' && action.user) {
//                 return [...state, action.user];
//             } else if (action.type === 'delete') {
//                 return state.filter(
//                     user => user.name !== 'Dodane poprzez Server Actions',
//                 );
//             }
//             return state;
//         },
//     );

//     return (
//         <div className="user-list">
//             {optimisticUsers?.map(user => <h3 key={user.id}>{user.name}</h3>)}
//             <AddUser handleOptimisticUsers={handleOptimisticUsers} />
//         </div>
//     );
// }

// export default UserList;
