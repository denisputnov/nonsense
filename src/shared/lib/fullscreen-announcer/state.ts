import {ReactNode} from 'react';
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';

export interface AnnouncerMessage {
  key: string;
  content: (onClose: () => void) => ReactNode;
  delay: number;
  isAutoClosable: boolean;
  isClosed: boolean;
  showCloseButton: boolean;
  onClose?: () => void;
}

interface State {
  queue: AnnouncerMessage[];
  shownMessages: AnnouncerMessage[];
  current: AnnouncerMessage | undefined;
}

interface Actions {
  enqueueMessage: (message: AnnouncerMessage) => void;
  shiftQueue: () => void;
  reset: () => void;
}

const DEFAULT: State = {
  current: undefined,
  queue: [],
  shownMessages: [],
};
export const useAnnouncerState = create<State & Actions>()(
  immer(set => ({
    ...DEFAULT,
    enqueueMessage: message =>
      set(state => {
        state.queue.push(message);
        state.current = state.queue.at(0);
      }),
    shiftQueue: () => {
      set(state => {
        if (!state.current) return;

        const message = state.queue.shift();
        state.current = state.queue.at(0);

        if (!message) return;

        state.shownMessages.push(message);
      });
    },
    reset: () => set({...DEFAULT}),
  }))
);
