'use client';

import {usePulsarState} from '@/shared/pulsar';
import {GameField, Preparation, End} from './_components';

export default function Page() {
  const {sessionData} = usePulsarState();

  if (!sessionData?.state) return null;

  return {
    started: <GameField />,
    preparation: <Preparation />,
    end: <End />,
  }[sessionData.state];
}
