import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const prettifyNumber = (value: number | string | undefined | null) =>
  value?.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

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

export const downloadJSON = (data: unknown, filename = 'data.json') => {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const randomInteger = (min: number, max: number, step = 1) => {
  min = Math.ceil(min / step) * step;
  max = Math.floor(max / step) * step;

  const count = Math.floor((max - min) / step) + 1;

  const randomIndex = Math.floor(Math.random() * count);

  return min + randomIndex * step;
};

export const exhaustiveCheck = (value: never): never => {
  throw new Error("Didn't expect to get here");
};
