import {z} from 'zod';

export const ANY_OBJECT_SCHEMA = z.custom<Record<string, any>>(data => {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
});

export const SESSION_CODE_SCHEMA = z
  .string('Обязательное поле')
  .length(5, {message: 'Длина кода должна быть 5 символов'})
  .regex(/^[a-zA-Z0-9]{5}$/, {message: 'Код должен содержать только цифры и символы латинского алфавита'});

export const USERNAME_SCHEMA = z
  .string('Не может быть пустым')
  .min(2, {message: 'Не может быть короче двух символов'})
  .max(64, {message: 'Не может быть более 64 символов'});

export const SocketMessage__Connect = z.object({
  type: z.literal('connect'),
  clientId: z.uuidv4(),
  username: USERNAME_SCHEMA,
  meta: ANY_OBJECT_SCHEMA.optional(),
});

export const SocketMessage__Disconnect = z.object({
  type: z.literal('disconnect'),
  clientId: z.uuidv4(),
  username: USERNAME_SCHEMA,
  meta: ANY_OBJECT_SCHEMA.optional(),
});

export const SocketMessage__Message = z.object({
  type: z.literal('message'),
  clientId: z.uuidv4(),
  message: z.string(),
  meta: ANY_OBJECT_SCHEMA.optional(),
});

export const SocketMessage__Event = z.object({
  type: z.literal('event'),
  event: z.string(),
  meta: ANY_OBJECT_SCHEMA.optional(),
});

export const SocketMessage__Sync = z.object({
  type: z.literal('sync'),
  initiatorId: z.uuidv4(),
  sessionId: z.uuidv4(),
  createdBy: z.uuidv4(),
  code: SESSION_CODE_SCHEMA,
  clients: z.record(
    z.uuidv4(),
    z.object({
      connected: z.boolean(),
      username: USERNAME_SCHEMA,
    })
  ),
  data: ANY_OBJECT_SCHEMA,
});

export enum SocketMessageErrorCode {
  UnknownError,
  FailedToParseMessage,
  UnsupportedMessageType,
  FailedToSyncSessionData,
}

export const SocketMessage__Error = z.object({
  type: z.literal('error'),
  message: z.string(),
  code: z.enum(SocketMessageErrorCode),
});

export const SocketMessage__Ping = z.object({type: z.literal('ping')});
export const SocketMessage__Pong = z.object({type: z.literal('pong')});

export const SocketMessageSchema = z.discriminatedUnion('type', [
  SocketMessage__Connect,
  SocketMessage__Disconnect,
  SocketMessage__Message,
  SocketMessage__Error,
  SocketMessage__Event,
  SocketMessage__Sync,
  SocketMessage__Ping,
  SocketMessage__Pong,
]);

const buildMessage =
  <Schema extends {type: string}>(type: Schema['type']) =>
  (input: Omit<Schema, 'type'>) => {
    return JSON.stringify({
      type,
      ...input,
    });
  };

export const BuildSocketMessage = {
  Connect: buildMessage<z.infer<typeof SocketMessage__Connect>>('connect'),
  Disconnect: buildMessage<z.infer<typeof SocketMessage__Disconnect>>('disconnect'),
  Message: buildMessage<z.infer<typeof SocketMessage__Message>>('message'),
  Error: buildMessage<z.infer<typeof SocketMessage__Error>>('error'),
  Event: buildMessage<z.infer<typeof SocketMessage__Event>>('event'),
  Sync: buildMessage<z.infer<typeof SocketMessage__Sync>>('sync'),
  Ping: buildMessage<z.infer<typeof SocketMessage__Ping>>('ping').bind(null, {}),
  Pong: buildMessage<z.infer<typeof SocketMessage__Pong>>('pong').bind(null, {}),
};
