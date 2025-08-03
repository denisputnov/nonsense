'use client';

import {usePulsarClient, usePulsarState} from '@/shared/lib/pulsar';
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

  const question = Question[questionsListKey];

  const formattedStory = question.buildStory(finalStories[clientId]);

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
      <CardBody className="flex flex-col gap-4">
        {formattedStory}
        <div className="divide-y-1 divide-divider">
          {question.def.map(({title, answerType}, index) => (
            <div key={index} className="px-1 py-2">
              <p className="text-xs opacity-60">{title}</p>
              <p>{answerRenderer(answerType, capitalize(finalStories[clientId][index]))}</p>
            </div>
          ))}
        </div>
      </CardBody>
      <StoryActionFooter />
    </Card>
  );
};
