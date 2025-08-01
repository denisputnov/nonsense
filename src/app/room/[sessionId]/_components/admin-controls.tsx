'use client';

import {Alert, Card, CardBody, CardHeader, Chip} from '@heroui/react';
import {PropsWithChildren} from 'react';
import {ClientMeta, usePulsarState, useSyncPulsarState} from '@/shared/pulsar';
import {ButtonWithConfirm} from '@/shared/ui';
import {ArrowBigRightDashIcon, CheckIcon, ClockIcon, RotateCcwIcon} from 'lucide-react';
import {DEFAULT_SESSION_STATE} from '@/shared/default-session-state';

const Parameter = ({label, reversed, children}: {label: string; reversed?: boolean} & PropsWithChildren) => {
  if (reversed) {
    return (
      <div className="flex flex-col">
        <label>{label}</label>
        <span className="text-xs opacity-60">{children}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <label className="text-xs opacity-60">{label}</label>
      {children}
    </div>
  );
};

const InGameControls = () => {
  const {sessionData, clients} = usePulsarState();
  const sync = useSyncPulsarState();

  if (!sessionData) return null;

  const {players, playerReadyState} = sessionData;

  const onRestart = () => {
    sync(() => DEFAULT_SESSION_STATE);
  };

  return (
    <Card className="w-full max-w-[800px]">
      <CardHeader>Панель администратора — видна только вам</CardHeader>
      <CardBody className="gap-2">
        <div className="flex flex-wrap gap-2">
          {players.map(clientId => (
            <Chip
              key={clientId}
              variant="flat"
              color={playerReadyState?.[clientId] ? 'success' : 'primary'}
              startContent={playerReadyState?.[clientId] ? <CheckIcon size={12} /> : <ClockIcon size={12} />}
              className="pl-2.5 gap-1"
            >
              {clients?.[clientId]?.username}
            </Chip>
          ))}
        </div>
        <ButtonWithConfirm
          onConfirm={onRestart}
          config={{
            default: {
              button: {
                fullWidth: true,
                startContent: <RotateCcwIcon size={16} />,
                children: `Перезапустить игру`,
                color: 'primary',
                variant: 'flat',
              },
              tooltip: {
                content: 'Нажмите чтобы сыграть ещё раз',
              },
            },
            confirmationRequested: {
              button: {
                fullWidth: true,
                startContent: <CheckIcon size={16} />,
                children: 'Подтвердите перезапуск',
                color: 'success',
              },
              tooltip: {
                content: 'Нажмите второй раз для подтверждения',
              },
            },
          }}
        />
      </CardBody>
    </Card>
  );
};

const EndControls = () => {
  const {sessionData, clients} = usePulsarState();
  const sync = useSyncPulsarState();

  if (!sessionData) return null;

  const {narratorsOrder, currentNarratorIndex} = sessionData;

  const currentNarratorClientId = narratorsOrder[currentNarratorIndex];

  const prevNarratorIndex = narratorsOrder[currentNarratorIndex - 1];
  const nextNarratorIndex = narratorsOrder[currentNarratorIndex + 1];

  const currentActorMeta: ClientMeta | undefined = clients[currentNarratorClientId];

  const prevNarratorMeta: ClientMeta | undefined = clients[prevNarratorIndex];
  const nextNarratorMeta: ClientMeta | undefined = clients[nextNarratorIndex];

  const goPrev = () => {
    sync(data => {
      if (data.currentNarratorIndex > 0) {
        data.currentNarratorIndex--;
      }

      return data;
    });
  };

  const goNext = () => {
    sync(data => {
      if (data.currentNarratorIndex + 1 < data.narratorsOrder.length) {
        data.currentNarratorIndex++;
      }

      return data;
    });
  };

  const onRestart = () => {
    sync(() => DEFAULT_SESSION_STATE);
  };

  return (
    <Card className="w-full max-w-[800px]">
      <CardHeader>Панель администратора — видна только вам</CardHeader>
      <CardBody className="gap-2">
        <div className="flex flex-wrap gap-4">
          <Parameter label="Счётчик ходов">
            Сходили: {currentNarratorIndex}/{narratorsOrder.length}
          </Parameter>
          <Parameter label="Предыдущий игрок">{prevNarratorMeta?.username ?? '—'}</Parameter>
          <Parameter label="Сейчас ходит игрок">{currentActorMeta?.username ?? '—'}</Parameter>
          <Parameter label="Следующий игрок">{nextNarratorMeta?.username ?? '—'}</Parameter>
        </div>

        <Alert
          className="h-fit p-2"
          classNames={{mainWrapper: 'min-h-auto'}}
          hideIcon
          color="warning"
          title="Кнопки управления используйте только в экстренных случаях"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <ButtonWithConfirm
            onConfirm={goPrev}
            config={{
              default: {
                button: {
                  fullWidth: true,
                  startContent: <ArrowBigRightDashIcon size={16} className="rotate-180" />,
                  children: `Передать ход предыдущему`,
                  color: 'primary',
                  variant: 'flat',
                  isDisabled: !prevNarratorMeta,
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
                  color: 'warning',
                },
                tooltip: {
                  content: 'Нажмите второй раз для подтверждения',
                },
              },
            }}
          />
          <ButtonWithConfirm
            onConfirm={goNext}
            config={{
              default: {
                button: {
                  fullWidth: true,
                  endContent: <ArrowBigRightDashIcon size={16} />,
                  children: `Передать ход следующему`,
                  color: 'primary',
                  variant: 'flat',
                  isDisabled: !nextNarratorMeta,
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
                  color: 'warning',
                },
                tooltip: {
                  content: 'Нажмите второй раз для подтверждения',
                },
              },
            }}
          />
        </div>
        <ButtonWithConfirm
          onConfirm={onRestart}
          config={{
            default: {
              button: {
                fullWidth: true,
                startContent: <RotateCcwIcon size={16} />,
                children: `Перезапустить игру`,
                color: 'primary',
                variant: 'flat',
              },
              tooltip: {
                content: 'Нажмите чтобы сыграть ещё раз',
              },
            },
            confirmationRequested: {
              button: {
                fullWidth: true,
                startContent: <CheckIcon size={16} />,
                children: 'Подтвердите перезапуск',
                color: 'success',
              },
              tooltip: {
                content: 'Нажмите второй раз для подтверждения',
              },
            },
          }}
        />
      </CardBody>
    </Card>
  );
};

export const AdminControls = () => {
  const {sessionData} = usePulsarState();

  if (!sessionData) return null;

  return {
    started: <InGameControls />,
    preparation: null,
    end: <EndControls />,
  }[sessionData.state];
};
