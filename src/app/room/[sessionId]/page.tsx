'use client';

import {usePulsarState} from '@/shared/pulsar';
import {GameField, Preparation, End} from './_scenes';
import {AdminControls} from './_components';

export default function Page() {
  const {sessionData} = usePulsarState();

  if (!sessionData?.state) return null;

  const scene = {
    started: <GameField />,
    preparation: <Preparation />,
    end: <End />,
  }[sessionData.state];

  const showAdminPanel = sessionData.state !== 'preparation';

  return (
    <div className="flex flex-col gap-2 justify-start md:justify-center items-center min-h-screen p-2">
      {showAdminPanel && <AdminControls />}
      {scene}
    </div>
  );
}
