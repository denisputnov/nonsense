import type {Metadata, Viewport} from 'next';
import './globals.css';
import {Providers} from '@/app/providers';
import {formatMetadata} from '@/app/metadata';

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
          <main className="min-h-screen center-gradient">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
