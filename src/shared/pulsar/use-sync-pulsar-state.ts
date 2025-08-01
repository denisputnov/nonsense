'use client';

import {useCallback} from 'react';

import {usePulsarV1Connection} from './pulsar-v1-connection';
import {usePulsarState} from './pulsar-state';
import {usePulsarClient} from './pulsar-client';
import {SessionData} from './session-data';
import {BuildSocketMessage} from '@/shared/pulsar/socket-message';

export const useSyncPulsarState = () => {
  const {send} = usePulsarV1Connection();
  const {clients, sessionId, code, getSessionDataCopy, createdBy} = usePulsarState();
  const {clientId} = usePulsarClient();

  return useCallback(
    (buildNewSessionState: (data: SessionData) => SessionData) => {
      if (!sessionId || !code || !createdBy) return false;

      const dataCopy = getSessionDataCopy();

      if (!dataCopy) return false;

      send(
        BuildSocketMessage.Sync({
          data: buildNewSessionState(dataCopy),
          createdBy: createdBy,
          initiatorId: clientId,
          sessionId,
          code,
          clients,
        })
      );
      return true;
    },
    [clientId, sessionId, createdBy, code, clients, getSessionDataCopy, send]
  );
};
