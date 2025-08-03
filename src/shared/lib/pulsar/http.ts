import axios, {AxiosResponse} from 'axios';
import {usePulsarClient} from './pulsar-client';
import {Session} from './types';
import {SessionData} from './session-data';

export const $pulsar = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PULSAR_URL,
});

$pulsar.interceptors.request.use(req => {
  const clientState = usePulsarClient.getState();
  req.headers['X-Pulsar-Client-Id'] = clientState.clientId;
  return req;
});

const createSession = (defaultState: SessionData): Promise<AxiosResponse<Session<SessionData>>> => {
  return $pulsar.post('/v1/session/initialize', defaultState);
};

export const PulsarHttpClient = {
  createSession,
};
