'use client';

import {createContext, PropsWithChildren, RefObject, useCallback, useContext, useEffect, useRef} from 'react';
import {BuildSocketMessage, SocketMessageSchema} from './socket-message';
import {z} from 'zod';
import {usePulsarClient} from './pulsar-client';
import {useLatest} from './use-latest';
import {Session} from './types';
import {usePulsarState} from './pulsar-state';
import {SessionData} from './session-data';

const PING_PONG_INTERVAL = 60_000; // in milliseconds

type PulsarV1ConnectionOptions = {
  sessionId: string;

  onConnect?: () => void;
  onOtherClientConnect?: () => void;

  onDisconnect?: () => void;
  onOtherClientDisconnect?: () => void;

  onMessage?: (message: z.infer<typeof SocketMessageSchema>) => void;

  historyLimit?: number;
};

interface PulsarV1ConnectionContextType {
  clientRef: RefObject<WebSocket | null>;
  send: (message: string) => boolean;
}

const PulsarV1ConnectionContext = createContext<PulsarV1ConnectionContextType | null>(null);

export const usePulsarV1Connection = () => {
  const context = useContext(PulsarV1ConnectionContext);

  if (!context) {
    throw new Error('pulsarV1Connection must be used within PulsarV1ConnectionContext');
  }

  return context;
};

export const PulsarConnectionProvider = ({
  children,
  sessionId,
  onConnect,
  onOtherClientConnect,
  onDisconnect,
  onOtherClientDisconnect,
  onMessage,
}: PropsWithChildren & PulsarV1ConnectionOptions) => {
  const socketUrl = `${process.env.NEXT_PUBLIC_PULSAR_URL}/v1/session/${sessionId}`;

  const latestOnConnect = useLatest(onConnect);
  const latestOnOtherClientConnect = useLatest(onOtherClientConnect);
  const latestOnDisconnect = useLatest(onDisconnect);
  const latestOnOtherClientDisconnect = useLatest(onOtherClientDisconnect);
  const latestOnMessage = useLatest(onMessage);

  const {clientId, username, isUsernameValid} = usePulsarClient();

  const clientRef = useRef<WebSocket | null>(null);

  const pulsarState = usePulsarState();

  const lastMessageTimestampRef = useRef<number | null>(null);

  const send = useCallback(
    (message: string) => {
      const isConnected = clientRef.current?.readyState === clientRef.current?.OPEN;
      if (!clientRef.current || !isConnected) return false;

      try {
        const {data, success, error} = SocketMessageSchema.safeParse(JSON.parse(message));

        if (!success) {
          console.error(error);
          throw new Error('Use BuildSocketMessage instead of custom message object');
        }

        clientRef.current.send(JSON.stringify(data));
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [clientRef, pulsarState.isConnected]
  );

  useEffect(() => {
    if (!clientId || !username || !isUsernameValid) return;

    let ws = clientRef.current;

    if (!ws) {
      ws = new WebSocket(socketUrl);
      clientRef.current = ws;
    }

    const pingInterval = setInterval(() => {
      const last = lastMessageTimestampRef.current;

      if (!last) return;

      const now = Date.now();
      const silentFor = now - last;

      if (silentFor > PING_PONG_INTERVAL && pulsarState.isConnected) {
        send(BuildSocketMessage.Ping());
      }
    }, PING_PONG_INTERVAL);

    ws.onopen = () => {
      pulsarState.setIsConnected(true);
      send(BuildSocketMessage.Connect({clientId, username}));
      latestOnConnect.current?.();
    };

    ws.onmessage = event => {
      pulsarState.setIsConnected(true);
      const {data: message, success} = SocketMessageSchema.safeParse(JSON.parse(event.data));

      if (!success) return;

      latestOnMessage.current?.(message);

      if (!lastMessageTimestampRef.current) {
        lastMessageTimestampRef.current = Date.now();
      }

      const messageType = message.type;

      switch (messageType) {
        case 'sync':
          const {initiatorId, clients, data, sessionId, code} = message as unknown as Session<SessionData>;
          pulsarState.pushSession({
            lastSyncInitiatorId: initiatorId,
            clients,
            code,
            sessionId,
            sessionData: data,
            createdBy: message.createdBy,
          });
          break;
        case 'event':
          pulsarState.pushEvent(message);
          break;
        case 'message':
          pulsarState.pushMessage(message);
          break;
        case 'connect':
          latestOnOtherClientConnect.current?.();
          break;
        case 'disconnect':
          latestOnOtherClientDisconnect.current?.();
          break;
      }
    };

    ws.onerror = () => {
      pulsarState.setIsConnected(false);
    };

    ws.onclose = () => {
      pulsarState.setIsConnected(false);
    };

    const handleBeforeUnload = () => {
      if (pulsarState.isConnected) {
        send(BuildSocketMessage.Disconnect({clientId, username}));
        latestOnDisconnect?.current?.();
        ws.close();
      }
      pulsarState.setIsConnected(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(pingInterval);

      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [
    clientId,
    username,
    socketUrl,
    isUsernameValid,
    send,
    latestOnConnect,
    latestOnDisconnect,
    latestOnMessage,
    latestOnOtherClientConnect,
    latestOnOtherClientDisconnect,
    pulsarState.isConnected,
  ]);

  useEffect(
    () => () => {
      const isConnected = clientRef.current?.readyState === clientRef.current?.OPEN;
      if (!clientRef.current || !isConnected) return;

      send(BuildSocketMessage.Disconnect({clientId, username}));
      clientRef.current.close();
      pulsarState.setIsConnected(false);
    },
    [clientRef, clientId, username]
  );

  return <PulsarV1ConnectionContext.Provider value={{clientRef, send}}>{children}</PulsarV1ConnectionContext.Provider>;
};
