'use clients';

import {Button, Card, CardBody, CardFooter, CardHeader} from '@heroui/react';
import {usePlayers} from '@/shared/hooks';
import {usePulsarClient, usePulsarState, useSyncPulsarState} from '@/shared/lib/pulsar';
import {Question} from '@/shared/questions';
import {useEffect, useRef, useState} from 'react';
import {Textarea} from '@heroui/input';
import {FinalStoryShuffle} from '@/shared/final-story-shuffle';
import shuffle from 'lodash/shuffle';
import {useFullscreenAnnouncer} from '@/shared/lib/fullscreen-announcer';
import {NextQuestion} from '@/shared/announcements/next-question';

export const GameField = () => {
  const players = usePlayers();
  const {clientId} = usePulsarClient();
  const {sessionData} = usePulsarState();
  const sync = useSyncPulsarState();
  const {pushMessage} = useFullscreenAnnouncer();

  const [text, setText] = useState<string>('');
  const isInputInvalid = text.length < 1;

  const [isToggledRecently, setIsToggledRecently] = useState(false);
  const toggleTimeoutRef = useRef<number | null>(null);

  const [touched, setTouched] = useState<boolean>(false);

  useEffect(
    () => () => {
      if (toggleTimeoutRef.current) {
        clearTimeout(toggleTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    setText('');
    setTouched(false);

    if (!sessionData) return;

    const {title} = Question?.[sessionData?.questionsListKey]?.def?.[sessionData.currentQuestionIndex];

    pushMessage({
      content: () => <NextQuestion question={title} />,
      isAutoClosable: true,
      delay: 500,
    });
  }, [sessionData?.currentQuestionIndex, pushMessage]);

  if (!sessionData) return null;

  const question = Question?.[sessionData?.questionsListKey];

  const {title, description} = question?.def?.[sessionData.currentQuestionIndex];

  const isCurrentPlayerReady = sessionData?.playerReadyState?.[clientId] ?? false;
  const readyPlayersCount = Object.entries(sessionData?.playerReadyState).filter(([, isReady]) => isReady).length;

  const onReadyStateToggle = () => {
    setText(text.trim());

    const isOperationSuccess = sync(data => {
      data.playerReadyState[clientId] = !data.playerReadyState[clientId];

      const readyPlayersCount = Object.entries(data.playerReadyState).filter(([, isReady]) => isReady).length;
      const isAllPlayersReady = readyPlayersCount === players.length;

      const isLastQuestion = data.currentQuestionIndex + 1 === Question?.[data.questionsListKey]?.def?.length;

      if (Array.isArray(data.answers[clientId])) {
        data.answers[clientId][data.currentQuestionIndex] = text;
      } else {
        data.answers[clientId] = [text];
      }

      if (isLastQuestion && isAllPlayersReady) {
        data.state = 'end';
        data.finalStories = FinalStoryShuffle[data.finalStoryShuffleStrategy].callback({answers: data.answers});
        data.narratorsOrder = shuffle(data.players);
        data.currentNarratorIndex = 0;
        return data;
      }

      if (isAllPlayersReady) {
        data.currentQuestionIndex += 1;
        data.playerReadyState = {};
      }

      return data;
    });

    if (isOperationSuccess) {
      setIsToggledRecently(true);
      setTimeout(() => {
        setIsToggledRecently(false);
      }, 1000);
    }
  };

  return (
    <Card className="w-full max-w-[800px]">
      <CardHeader className="flex flex-col items-start">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && <p className="opacity-60">{description}</p>}
      </CardHeader>
      <CardBody>
        <Textarea
          label={`Ваш ответ на вопрос «${title}»`}
          value={text}
          onValueChange={setText}
          errorMessage={isInputInvalid ? 'Не может быть пустым' : null}
          isInvalid={touched && isInputInvalid}
          isDisabled={isCurrentPlayerReady}
          onBlur={() => {
            setTouched(true);
            setText(text.trim());
          }}
          maxLength={512}
        />
      </CardBody>
      <CardFooter className="flex flex-col gap-1">
        <Button
          color="success"
          variant={isCurrentPlayerReady ? 'solid' : 'flat'}
          isDisabled={isInputInvalid || isToggledRecently}
          fullWidth
          onPress={onReadyStateToggle}
        >
          {isCurrentPlayerReady ? 'Изменить' : 'Готов'}
        </Button>
        <p className="opacity-60 text-sm">
          Игроков готово: {readyPlayersCount}/{players.length}
        </p>
      </CardFooter>
    </Card>
  );
};
