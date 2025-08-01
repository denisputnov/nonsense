'use client';

import {Button} from '@heroui/react';
import {useMutation} from '@tanstack/react-query';
import {PulsarHttpClient} from '@/shared/pulsar';
import {useRouter} from 'next/navigation';
import {DEFAULT_SESSION_STATE} from '@/shared/default-session-state';

export const CreateSessionButton = () => {
  const router = useRouter();

  const {mutate, isPending} = useMutation({
    mutationFn: () => PulsarHttpClient.createSession(DEFAULT_SESSION_STATE),
    onSuccess: response => {
      router.push(`/lobby?i=${response.data.sessionId}`);
    },
  });

  return (
    <Button color="primary" isLoading={isPending} onPress={() => mutate()} variant="shadow">
      Создать комнату
    </Button>
  );
};
