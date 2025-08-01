import {Geist, Geist_Mono, Reggae_One} from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const reggaeOne = Reggae_One({
  subsets: ['cyrillic'],
  weight: '400',
});

export const Font = {
  Default: `${geistSans.className} ${geistMono.className}`,
  Reggae: reggaeOne.className,
} as const;
