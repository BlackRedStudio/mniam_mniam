import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNameInitials(userName: string) {
  const userNameArr = userName.split(' ');

  let nameInitials = userNameArr[0][0] + userNameArr[0][1];

  if (userNameArr.length > 1) {
      nameInitials = userNameArr[0][0] + userNameArr[1][0];
  }

  return nameInitials.toUpperCase();
}
