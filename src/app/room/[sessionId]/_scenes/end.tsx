'use client';

import {usePulsarClient, usePulsarState} from '@/shared/pulsar';
import {WaitingList, StoryRenderer} from '../_components';

export const End = () => {
  const {sessionData} = usePulsarState();
  const {clientId} = usePulsarClient();

  if (!sessionData) return null;

  const {currentNarratorIndex, narratorsOrder} = sessionData;

  const myIndexInNarratorList = narratorsOrder.indexOf(clientId);

  if (myIndexInNarratorList === currentNarratorIndex) {
    return <StoryRenderer />;
  }

  return <WaitingList />;
};
