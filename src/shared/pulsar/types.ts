import {z} from 'zod';
import {SocketMessage__Sync} from '@/shared/pulsar/socket-message';

export type Session<Data extends Record<string, any>> = Omit<z.infer<typeof SocketMessage__Sync>, 'data'> & {
  data: Data;
};
