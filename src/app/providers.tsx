'use client';

import {PropsWithChildren, useState} from 'react';
import {HeroUIProvider} from '@heroui/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ThemeProvider as NextThemesProvider} from 'next-themes';

export const Providers = ({children}: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
};
