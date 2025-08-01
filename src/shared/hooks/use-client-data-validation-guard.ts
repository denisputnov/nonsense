'use client';

import {useEffect} from 'react';
import {usePulsarClient} from '@/shared/pulsar';
import {useParams, useRouter} from 'next/navigation';

export const useClientDataValidationGuard = () => {
  const {sessionId} = useParams<{sessionId: string}>();
  const {isUsernameValid} = usePulsarClient();

  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isUsernameValid) {
        router.replace(`/lobby?i=${sessionId}`);
      }
    }, 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [isUsernameValid, router, sessionId]);
};
