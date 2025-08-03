import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {USERNAME_SCHEMA} from '@/shared/lib/pulsar/socket-message';

export const LOCAL_STORAGE_KEY = 'pulsar-client';

interface PulsarClient {
  clientId: string;
  username: string;
  isUsernameValid: boolean;
  usernameErrorMessage: string | null;
}

interface PulsarClientActions {
  setUsername: (username: string) => void;
  reset: () => void;
}

type PulsarClientState = PulsarClient & PulsarClientActions;

const DEFAULT: PulsarClient = {
  clientId: crypto.randomUUID(),
  username: '',
  isUsernameValid: false,
  usernameErrorMessage: 'Не может быть короче двух символов',
};

export const usePulsarClient = create<PulsarClientState>()(
  persist<PulsarClientState>(
    set => ({
      ...DEFAULT,
      setUsername: (newUsername: string) => {
        const {success: isUsernameValid, error} = USERNAME_SCHEMA.safeParse(newUsername);

        set({isUsernameValid, username: newUsername, usernameErrorMessage: error?.flatten()?.formErrors?.[0]});
      },
      reset: () => set({...DEFAULT}),
    }),
    {
      name: LOCAL_STORAGE_KEY,
      version: 1,
    }
  )
);

usePulsarClient.setState({});
