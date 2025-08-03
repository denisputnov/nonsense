import type {Metadata, Viewport} from 'next';
import './globals.css';
import {Providers} from '@/app/providers';
import {formatMetadata} from '@/app/metadata';
import {Suspense} from 'react';
import {Umami} from '@/app/umami';
import {Header} from '@/shared/components';

export const metadata: Metadata = formatMetadata({
  title: 'Чепуха',
  description: 'Создайте онлайн комнату для игры в Чепуху с друзьями',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <div className="center-gradient">
            <Header />
            <main className="flex flex-col gap-2 min-h-screen-no-header">{children}</main>
          </div>
        </Providers>
        <Suspense>
          <Umami />
        </Suspense>
      </body>
    </html>
  );
}
