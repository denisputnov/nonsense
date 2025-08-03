'use client';

import {PropsWithChildren, useCallback, useEffect} from 'react';
import {useAnnouncerState, AnnouncerMessage} from './state';
import {AnimatePresence, motion} from 'framer-motion';
import {Button} from '@heroui/react';
import {XIcon} from 'lucide-react';
import {useLatest} from './use-latest';

export type MakePartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const useFullscreenAnnouncer = () => {
  const {enqueueMessage} = useAnnouncerState();

  const pushMessage = useCallback(
    ({
      key,
      content,
      delay,
      isAutoClosable,
      showCloseButton,
      onClose,
    }: MakePartial<
      Omit<AnnouncerMessage, 'isClosed'>,
      'delay' | 'isAutoClosable' | 'key' | 'showCloseButton' | 'onClose'
    >) => {
      const autoClosable = isAutoClosable ?? true;

      const message: AnnouncerMessage = {
        key: key ?? crypto.randomUUID(),
        content,
        delay: (delay ?? 2000) + 1500, // + скорость анимации,
        isAutoClosable: autoClosable,
        isClosed: false,
        showCloseButton: showCloseButton ?? !autoClosable,
        onClose,
      };

      enqueueMessage(message);
    },
    [enqueueMessage]
  );

  return {pushMessage};
};

export const FullScreenAnnouncerProvider = ({children}: PropsWithChildren) => {
  const state = useAnnouncerState();

  const {current, shiftQueue} = state;

  const latestCurrentOnClose = useLatest(current?.onClose);

  const onClose = useCallback(() => {
    latestCurrentOnClose.current?.();
    shiftQueue();
  }, [shiftQueue, latestCurrentOnClose]);

  useEffect(() => {
    if (!current || !current.isAutoClosable) return;

    const timeout = setTimeout(onClose, current.delay);

    return () => clearTimeout(timeout);
  }, [current, onClose]);

  const getCloseButtonDisplayCondition = () => {
    if (current?.isAutoClosable) return false;

    return current?.showCloseButton;
  };

  return (
    <>
      {children}
      <AnimatePresence initial>
        {current && (
          <motion.div
            className="absolute inset-0 p-2 pt-14 flex justify-center items-center bg-black/80 backdrop-blur-xs h-screen w-screen z-[99999]"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
          >
            {getCloseButtonDisplayCondition() && (
              <Button variant="flat" isIconOnly className="absolute right-2 top-2" onPress={onClose}>
                <XIcon size={16} />
              </Button>
            )}
            <motion.div
              initial={{opacity: 0, transformOrigin: 'left', transform: 'translateY(200px)'}}
              animate={{opacity: 1, transform: 'translateY(0px)'}}
              exit={{opacity: 0}}
              transition={{
                duration: 1.5,
                delay: 0,
                ease: [0.65, 0, 0.15, 1],
              }}
            >
              {current.content(onClose)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
