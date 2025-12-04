import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-wind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
