'use client';

import {usePulsarState, useSyncPulsarState} from '@/shared/lib/pulsar';
import {CardFooter} from '@heroui/react';
import {ButtonWithConfirm} from '@/shared/ui';
import {ArrowBigRightDashIcon, CheckIcon} from 'lucide-react';

export const StoryActionFooter = () => {
  const {sessionData, clients} = usePulsarState();
  const sync = useSyncPulsarState();

  if (!sessionData) return null;

  const {currentNarratorIndex, narratorsOrder} = sessionData;

  const nextNarratorClientId: string | undefined = narratorsOrder[currentNarratorIndex + 1];

  const nextNarratorMeta = clients?.[nextNarratorClientId];

  if (!nextNarratorMeta) return null;

  const goToNextNarrator = () => {
    sync(data => {
      data.currentNarratorIndex += 1;
      return data;
    });
  };

  const onSubmit = () => {
    if (nextNarratorMeta) return goToNextNarrator();
  };

  return (
    <CardFooter>
      <ButtonWithConfirm
        onConfirm={onSubmit}
        config={{
          default: {
            button: {
              fullWidth: true,
              endContent: <ArrowBigRightDashIcon size={16} />,
              children: `Передать ход следующему`,
              color: 'primary',
              variant: 'flat',
            },
            tooltip: {
              content: 'Нажмите чтобы передать ход',
            },
          },
          confirmationRequested: {
            button: {
              fullWidth: true,
              startContent: <CheckIcon size={16} />,
              children: 'Подтвердите передачу хода',
              color: 'success',
            },
            tooltip: {
              content: 'Нажмите второй раз для подтверждения',
            },
          },
        }}
      />
    </CardFooter>
  );
};
