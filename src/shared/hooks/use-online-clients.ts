'use client';

import {useMemo} from 'react';
import {usePulsarState} from '../lib/pulsar';

export const useOnlineClients = () => {
  const {clients} = usePulsarState();

  return useMemo(() => {
    return Object.entries(clients).filter(entry => entry[1].connected);
  }, [clients]);
};
