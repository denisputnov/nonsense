import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exhaustiveCheck = (_: never): never => {
  throw new Error("Didn't expect to get here");
};
