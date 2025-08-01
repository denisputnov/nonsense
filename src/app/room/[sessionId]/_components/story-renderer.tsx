'use client';

import {usePulsarClient, usePulsarState} from '@/shared/pulsar';
import {Question, QuestionAnswerType} from '@/shared/questions';
import {exhaustiveCheck} from '@/shared/utils';
import {Card, CardBody, CardHeader} from '@heroui/react';
import capitalize from 'lodash/capitalize';
import {StoryActionFooter} from './story-action-footer';

export const StoryRenderer = () => {
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