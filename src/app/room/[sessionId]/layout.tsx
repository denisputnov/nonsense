'use client';

import {PropsWithChildren} from 'react';
import {PulsarConnectionProvider} from '@/shared/pulsar';
import {useParams} from 'next/navigation';
import {useClientDataValidationGuard} from '@/shared/hooks';

export default function Layout({children}: PropsWithChildren) {
  useClientDataValidationGuard();

  const {sessionId} = useParams<{sessionId: string}>();

  return (
    <PulsarConnectionProvider sessionId={sessionId}>
      <div className="flex flex-col justify-center items-center min-h-screen px-2">{children}</div>
    </PulsarConnectionProvider>
  );
}
