'use client';

import {Button, Link} from '@heroui/react';
import {useTheme} from 'next-themes';
import Image from 'next/image';
import {CreateSessionButton} from '@/shared/components';

export default function Page() {
  const {setTheme} = useTheme();

  return (
    <div className="flex flex-col gap-8 items-center justify-center h-screen px-8">
      <Image
        src={'title.svg'}
        width={600}
        height={5}
        alt="ЧЕПУХА"
        className="dark:opacity-60 select-none pointer-events-none"
      />
      <div className="flex gap-4">
        <CreateSessionButton />
        <Button
          variant="ghost"
          color="secondary"
          onPress={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
        >
          Тема
        </Button>
      </div>
    </div>
  );
}
