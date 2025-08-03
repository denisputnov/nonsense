import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = async (text: string) => {
  let textArea;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      textArea = document.createElement('textarea');
      textArea.value = text;

      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';

      document.body.prepend(textArea);
      textArea.select();

      document.execCommand('copy');

      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    textArea?.remove();
  }
};

export const exhaustiveCheck = (_: never): never => {
  throw new Error("Didn't expect to get here");
};
