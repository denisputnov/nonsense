import {usePulsarClient, usePulsarState} from '../lib/pulsar';

export const useIsSessionAuthor = () => {
  const {clientId} = usePulsarClient();
  const {createdBy} = usePulsarState();

  return createdBy === clientId;
};
