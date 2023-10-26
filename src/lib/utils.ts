import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserSesion() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return user;
}
