'use client';

import {Card, CardBody, CardFooter, CardHeader} from '@heroui/react';
import {usePulsarClient, usePulsarState, useSyncPulsarState} from '@/shared/pulsar';
import {Question, QuestionAnswerType} from '@/shared/questions';
import {cn, exhaustiveCheck} from '@/shared/utils';
import capitalize from 'lodash/capitalize';
import {ButtonWithConfirm} from '@/shared/ui';
import {ArrowBigRightDashIcon, CheckIcon} from 'lucide-react';

export const End = () => {
  const {sessionData} = usePulsarState();
  const {clientId} = usePulsarClient();

  if (!sessionData) return null;

  const {currentNarratorIndex, narratorsOrder} = sessionData;

  const myIndexInNarratorList = narratorsOrder.indexOf(clientId);

  if (myIndexInNarratorList === currentNarratorIndex) {
    return <StoryRenderer />;
  }

  return <WaitingList />;
};

const StoryRenderer = () => {
  const {sessionData} = usePulsarState();
  const {clientId} = usePulsarClient();

  if (!sessionData) return null;

  const {finalStories, questionsListKey} = sessionData;

  const questionsList = Question[questionsListKey].def;

  const answerRenderer = (type: QuestionAnswerType, content: string) => {
    switch (type) {
      case 'text':
        return content;
      case 'quote':
        return <span className="italic">«{content}»</span>;
      default:
        exhaustiveCheck(type);
    }
  };

  return (
    <Card className="w-full max-w-[800px]">
      <CardHeader>Расскажите свою историю</CardHeader>
      <CardBody className="divide-y-1 divide-divider">
        {questionsList.map(({title, answerType}, index) => (
          <div key={index} className="px-1 py-2">
            <p className="text-xs opacity-60">{title}</p>
            <p>{answerRenderer(answerType, capitalize(finalStories[clientId][index]))}</p>
          </div>
        ))}
      </CardBody>
      <StoryActionFooter />
    </Card>
  );
};

const StoryActionFooter = () => {
  const {sessionData, clients} = usePulsarState();
  const sync = useSyncPulsarState();

  if (!sessionData) return null;

  const {currentNarratorIndex, narratorsOrder} = sessionData;

  const nextNarratorClientId: string | undefined = narratorsOrder[currentNarratorIndex + 1];

  const nextNarratorMeta = clients?.[nextNarratorClientId];

  if (!nextNarratorMeta) return null;

  const goToNextNarrator = () => {
    sync(data => {
      data.currentNarratorIndex += 1;
      return data;
    });
  };

  const onSubmit = () => {
    if (nextNarratorMeta) return goToNextNarrator();
  };

  return (
    <CardFooter>
      <ButtonWithConfirm
        onConfirm={onSubmit}
        config={{
          default: {
            button: {
              fullWidth: true,
              startContent: <ArrowBigRightDashIcon size={16} />,
              children: `Передать ход следующему`,
              color: 'primary',
              variant: 'flat',
            },
            tooltip: {
              content: 'Нажмите чтобы передать ход',
            },
          },
          confirmationRequested: {
            button: {
              fullWidth: true,
              startContent: <CheckIcon size={16} />,
              children: 'Подтвердите передачу хода',
              color: 'success',
            },
            tooltip: {
              content: 'Нажмите второй раз для подтверждения',
            },
          },
        }}
      />
    </CardFooter>
  );
};

const WaitingList = () => {
  const {sessionData, clients} = usePulsarState();
  const {clientId} = usePulsarClient();

  if (!sessionData) return null;

  const {currentNarratorIndex, narratorsOrder} = sessionData;

  const myIndexInNarratorList = narratorsOrder.indexOf(clientId);

  return (
    <Card className="w-full max-w-[800px]">
      <CardHeader>Ожидайте своей очереди</CardHeader>
      <CardBody>
        <div className="flex flex-col divide-y divide-divider">
          {narratorsOrder.map((narratorId, index) => (
            <div
              key={narratorId}
              className={cn('px-1 py-2', {
                'text-inherit': currentNarratorIndex > index, // prev
                'text-success': currentNarratorIndex === index, // current
                'opacity-60': currentNarratorIndex < index, // next
              })}
            >
              <p>
                {clients[narratorId].username} {myIndexInNarratorList === index && <span>(вы)</span>}
              </p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
