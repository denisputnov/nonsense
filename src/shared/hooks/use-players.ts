'use client';

import {usePulsarState} from '@/shared/pulsar';
import {useMemo} from 'react';

export const usePlayers = () => {
  const {sessionData, clients} = usePulsarState();

  const players = sessionData?.players;

  return useMemo(() => {
    if (!players || players.length === 0) return [];

    return Object.entries(clients).filter(([clientId]) => players.includes(clientId));
  }, [clients, players]);
};
