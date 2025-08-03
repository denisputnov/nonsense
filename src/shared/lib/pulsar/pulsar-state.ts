import {create} from 'zustand';
import {SocketMessage__Event, SocketMessage__Message} from './socket-message';
import {z} from 'zod';

import {SessionData} from './session-data';

export interface ClientMeta {
  username: string;
  connected: boolean;
}

interface PulsarState {
  lastSyncInitiatorId: string | null;
  sessionId: string | null;
  createdBy: string | null;
  code: string | null;
  isConnected: boolean;
  clients: Record<string, ClientMeta>;

  sessionData: SessionData | null;
  sessionDataHistory: Array<SessionData>;

  event: z.infer<typeof SocketMessage__Event> | null;
  eventsHistory: Array<z.infer<typeof SocketMessage__Event>>;

  message: z.infer<typeof SocketMessage__Message> | null;
  messagesHistory: Array<z.infer<typeof SocketMessage__Message>>;
}

interface PulsarStateActions {
  setIsConnected: (isConnected: boolean) => void;

  pushSession: (
    data: Pick<PulsarState, 'lastSyncInitiatorId' | 'sessionId' | 'code' | 'clients' | 'sessionData' | 'createdBy'>
  ) => void;

  pushEvent: (data: z.infer<typeof SocketMessage__Event>) => void;

  pushMessage: (data: z.infer<typeof SocketMessage__Message>) => void;

  getSessionDataCopy: () => PulsarState['sessionData'];

  reset: () => void;
}

type PulsarStateComposed = PulsarState & PulsarStateActions;

const DEFAULT: PulsarState = {
  lastSyncInitiatorId: null,
  sessionId: null,
  createdBy: null,
  isConnected: false,
  code: null,
  clients: {},

  sessionData: null,
  sessionDataHistory: [],

  event: null,
  eventsHistory: [],

  message: null,
  messagesHistory: [],
};

const withLimit =
  (limit: number) =>
  <T>(array: T[], value: T): T[] => {
    if (!array) return [value];

    if (array.length < limit) return [...array, value];

    return [...array, value].slice(array.length - limit);
  };

const withLimit50 = withLimit(50);

export const usePulsarState = create<PulsarStateComposed>()((set, get) => ({
  ...DEFAULT,
  setIsConnected: (isConnected: boolean) => set({isConnected}),
  pushSession: data => {
    set(prev => ({
      ...prev,
      ...data,
    }));
  },
  pushEvent: event => {
    set(prev => ({
      event,
      eventsHistory: withLimit50(prev.eventsHistory, event),
    }));
  },
  pushMessage: message => {
    set(prev => ({
      message,
      messagesHistory: withLimit50(prev.messagesHistory, message),
    }));
  },
  getSessionDataCopy: () => {
    const state = get();

    if (state.sessionData === null) return null;

    return JSON.parse(JSON.stringify(state.sessionData));
  },
  reset: () => set({...DEFAULT}),
}));
