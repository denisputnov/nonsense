'use client';

import {usePulsarState} from '@/shared/lib/pulsar';
import {GameField, Preparation, End} from './_scenes';
import {AdminControls} from './_components';
import {useIsSessionAuthor} from '@/shared/hooks';

export default function Page() {
  const {sessionData} = usePulsarState();
  const isSessionAuthor = useIsSessionAuthor();

  if (!sessionData?.state) return null;

  const scene = {
    started: <GameField />,
    preparation: <Preparation />,
    end: <End />,
  }[sessionData.state];

  const showAdminPanel = sessionData.state !== 'preparation' && isSessionAuthor;

  return (
    <div className="flex flex-col gap-2 justify-start md:justify-center items-center min-h-screen-no-header p-2">
      {showAdminPanel && <AdminControls />}
      {scene}
    </div>
  );
}
