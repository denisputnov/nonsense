'use client';

import {PropsWithChildren, useState} from 'react';
import {HeroUIProvider} from '@heroui/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {FullScreenAnnouncerProvider} from '@/shared/lib/fullscreen-announcer';

export const Providers = ({children}: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <FullScreenAnnouncerProvider>{children}</FullScreenAnnouncerProvider>
        </QueryClientProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
};
