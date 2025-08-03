'use client';

import {PropsWithChildren} from 'react';
import {PulsarConnectionProvider} from '@/shared/lib/pulsar';
import {useParams} from 'next/navigation';
import {useClientDataValidationGuard} from '@/shared/hooks';

export default function Layout({children}: PropsWithChildren) {
  useClientDataValidationGuard();

  const {sessionId} = useParams<{sessionId: string}>();

  return <PulsarConnectionProvider sessionId={sessionId}>{children}</PulsarConnectionProvider>;
}
