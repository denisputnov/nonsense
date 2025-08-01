'use client';

import {usePulsarClient, usePulsarState} from '@/shared/pulsar';
import {Card, CardBody, CardHeader} from '@heroui/react';
import {cn} from '@/shared/utils';

export const WaitingList = () => {
  const {sessionData, clients} = usePulsarState();
  const {clientId} = usePulsarClient();

  if (!sessionData) return null;

  const {currentNarratorIndex, narratorsOrder} = sessionData;

  const myIndexInNarratorList = narratorsOrder.indexOf(clientId);

  return (
    <Card className="w-full max-w-[800px]">
      <CardHeader>Ожидайте своей очереди</CardHeader>
      <CardBody>
        <div className="flex flex-col divide-y divide-divider">
          {narratorsOrder.map((narratorId, index) => (
            <div
              key={narratorId}
              className={cn('px-1 py-2', {
                'text-inherit': currentNarratorIndex > index, // prev
                'text-success': currentNarratorIndex === index, // current
                'opacity-60': currentNarratorIndex < index, // next
              })}
            >
              <p>
                {clients[narratorId].username} {myIndexInNarratorList === index && <span>(вы)</span>}
              </p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
