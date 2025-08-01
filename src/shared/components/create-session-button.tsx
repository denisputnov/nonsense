'use client';

import {Button} from '@heroui/react';
import {useMutation} from '@tanstack/react-query';
import {PulsarHttpClient} from '@/shared/pulsar';
import {useRouter} from 'next/navigation';
import {SessionData} from '@/shared/pulsar/session-data';

const DEFAULT: SessionData = {
  finalStories: {},
  state: 'started',
  players: ['f6a5cdcb-5b01-4754-b29a-e49f6839f801', '0a5c4012-6169-4cf5-879c-bc27c53a0adf'],
  questionsListKey: 'default',
  currentQuestionIndex: 8,
  // answers: {},
  answers: {
    'f6a5cdcb-5b01-4754-b29a-e49f6839f801': [
      'Денис',
      'С виталиком',
      'Тогда',
      'В вгу',
      'Разговаривали',
      'коровченко',
      'Что-то сказал',
      'Ага да',
    ],
    '0a5c4012-6169-4cf5-879c-bc27c53a0adf': [
      'Вова',
      'С алибабой',
      'завтра',
      'на работе',
      'Шутили',
      'марсианин',
      'Привет чурки',
      'привет',
    ],
  },
  playerReadyState: {
    'f6a5cdcb-5b01-4754-b29a-e49f6839f801': false,
    '0a5c4012-6169-4cf5-879c-bc27c53a0adf': false,
  },
  finalStoryShuffleStrategy: 'next',
};

export const CreateSessionButton = () => {
  const router = useRouter();

  const {mutate, isPending} = useMutation({
    mutationFn: () => PulsarHttpClient.createSession(DEFAULT),
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
