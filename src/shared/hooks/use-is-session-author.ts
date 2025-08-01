import {usePulsarClient, usePulsarState} from '@/shared/pulsar';

export const useIsSessionAuthor = () => {
  const {clientId} = usePulsarClient();
  const {createdBy} = usePulsarState();

  console.log({clientId, createdBy});

  return createdBy === clientId;
};
