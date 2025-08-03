'use client';

import {Alert, Button, Card, CardBody, Chip, cn} from '@heroui/react';
import {InvitePlayersMenu, QuestionSelector, ShuffleStrategySelector} from '@/shared/components';
import {useOnlineClients} from '@/shared/hooks/use-online-clients';
import {useSyncPulsarState} from '@/shared/lib/pulsar';
import {useIsSessionAuthor} from '@/shared/hooks';

export const Preparation = () => {
  const clients = useOnlineClients();
  const sync = useSyncPulsarState();
  const isSessionAuthor = useIsSessionAuthor();

  const onStart = () => {
    sync(data => {
      data.state = 'started';
      data.players = clients.map(([clientId]) => clientId);

      return data;
    });
  };

  return (
    <Card className="w-full md:w-fit">
      <CardBody
        className={cn('w-full max-w-[800px] md:min-w-[400px] grid gap-2', {
          'grid-cols-1': !isSessionAuthor,
          'grid-cols-1 md:grid-cols-[2fr_1fr]': isSessionAuthor,
        })}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center gap-2">
            <h1 className="text-2xl font-semibold">Игроки</h1>
            <InvitePlayersMenu />
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            {clients.map(([clientId, {username}]) => (
              <Chip color="primary" variant="flat" key={clientId} size="lg">
                {username}
              </Chip>
            ))}
          </div>
          {!isSessionAuthor && (
            <div className="w-full">
              <Alert
                color="secondary"
                variant="flat"
                className="w-full"
                title="Ожидайте, когда автор комнаты запустит игру"
              />
            </div>
          )}
        </div>
        {isSessionAuthor && (
          <div className="flex flex-col-reverse md:flex-col gap-4 border-divider w-full md:w-[240px] border-t md:border-t-0 md:border-l pt-2 md:pl-2 md:pt-0">
            <Button color="primary" fullWidth onPress={onStart}>
              Начать игру
            </Button>

            <QuestionSelector />
            <ShuffleStrategySelector />
          </div>
        )}
      </CardBody>
    </Card>
  );
};
