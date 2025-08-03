'use client';

import {Button} from '@heroui/react';
import {MoonIcon, SunIcon} from 'lucide-react';
import {useTheme} from 'next-themes';
import {Tooltip} from '@heroui/tooltip';

export const Header = () => {
  const {theme, setTheme} = useTheme();

  return (
    <div className="flex gap-2 items-center h-fit p-2 max-w-[800px] mx-auto justify-end">
      <Tooltip content="Сменить тему">
        <Button
          isIconOnly
          variant="light"
          color="default"
          onPress={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
        >
          {theme === 'light' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
        </Button>
      </Tooltip>
    </div>
  );
};
