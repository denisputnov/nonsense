import Image from 'next/image';
import {ConnectExistingSessionButton, CreateSessionButton} from '@/shared/components';

export default function Page() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center h-screen-no-header flex-1 px-8">
      <Image
        src={'title.svg'}
        width={600}
        height={5}
        alt="ЧЕПУХА"
        className="dark:opacity-80 select-none pointer-events-none"
      />
      <div className="flex gap-4 flex-col sm:flex-row">
        <CreateSessionButton />
        <ConnectExistingSessionButton />
      </div>
    </div>
  );
}
