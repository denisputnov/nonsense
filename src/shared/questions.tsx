import {ReactNode} from 'react';
import {exhaustiveCheck} from './utils';
import capitalize from 'lodash/capitalize';

const Answer = ({value, type = 'text'}: {value: string; type?: QuestionAnswerType}) => {
  value = capitalize(value);

  const renderer = () => {
    switch (type) {
      case 'text':
        return value;
      case 'quote':
        return `«${value}»`;
      default:
        exhaustiveCheck(type);
    }
  };

  return <mark className="py-1 h-fit px-2 rounded-full bg-primary/20 text-primary-600">{renderer()}</mark>;
};

export type QuestionAnswerType = 'text' | 'quote';

export type QuestionDef = {
  answerType: QuestionAnswerType;
  title: string;
  description?: string;
};

export const DEFAULT_QUESTIONS: QuestionDef[] = [
  {
    title: 'Кто?',
    answerType: 'text',
  },
  {
    title: 'С кем?',
    answerType: 'text',
  },
  {
    title: 'Когда?',
    answerType: 'text',
  },
  {
    title: 'Где?',
    answerType: 'text',
  },
  {
    title: 'Что делали?',
    answerType: 'text',
  },
  {
    title: 'Тут пришёл:',
    answerType: 'text',
  },
  {
    title: 'И сказал:',
    answerType: 'quote',
  },
  {
    title: 'Ему ответили:',
    answerType: 'quote',
  },
  {
    title: 'И закончилось всё:',
    answerType: 'text',
  },
];

export const VIEW_FROM_THE_OUTSIDE_QUESTIONS: QuestionDef[] = [
  {
    title: 'Кто?',
    answerType: 'text',
  },
  {
    title: 'Где оказался?',
    answerType: 'text',
  },
  {
    title: 'Чтобы что сделать?',
    answerType: 'text',
  },
  {
    title: 'Что у него было в руке?',
    answerType: 'text',
  },
  {
    title: 'Кого он увидел вдали?',
    answerType: 'text',
  },
  {
    title: 'Что он кричал?',
    answerType: 'quote',
  },
  {
    title: 'Что про него подумали?',
    answerType: 'text',
  },
  {
    title: 'Чем всё закончилось?',
    answerType: 'text',
  },
];

const buildStoryForDefault = (answers: string[]) => {
  if (answers.length !== DEFAULT_QUESTIONS.length) return null;

  return (
    <div className="flex gap-y-0.5 gap-x-1 flex-wrap items-center">
      <Answer value={answers[0]} />
      {!answers[1].toLowerCase().startsWith('с ') ? <span>c</span> : null}
      <Answer value={answers[1]} />
      <Answer value={answers[2]} />
      <Answer value={answers[3]} />
      <Answer value={answers[4]} />
      <span>.</span>
      <span>Тут пришёл</span>
      <Answer value={answers[5]} />
      <span>и сказал</span> <Answer value={answers[6]} type="quote" />
      <span>.</span>
      <span>Ему ответили</span>
      <Answer value={answers[7]} type="quote" />
      <span>.</span>
      <span>Закончилось всё</span>
      <Answer value={answers[8]} />
      <span>.</span>
    </div>
  );
};

const buildStoryForViewFromTheOutside = (answers: string[]) => {
  if (answers.length !== VIEW_FROM_THE_OUTSIDE_QUESTIONS.length) return null;

  return (
    <div className="leading-7">
      <Answer value={answers[0]} />
      <span> оказался </span>
      <Answer value={answers[1]} />
      {!answers[2].toLowerCase().startsWith('чтобы ') ? <span>чтобы</span> : <span> </span>}
      <Answer value={answers[2]} />
      <span>. </span>
      <span> В руке у него было </span>
      <Answer value={answers[3]} />
      <span>. </span>
      <span> Он увидел </span>
      <Answer value={answers[4]} />
      <span> и закричал: </span>
      <Answer value={answers[5]} type="quote" />
      <span>. </span>
      <span> Про него подумали: </span>
      <Answer value={answers[6]} type="quote" />
      <span>. </span>
      <span> А закончилось всё </span>
      <Answer value={answers[7]} />
      <span>.</span>
    </div>
  );
};

export type QuestionMeta = {
  def: QuestionDef[];
  buildStory: (answers: string[]) => ReactNode;
  name: string;
  description: string;
};

export const Question = {
  default: {
    def: DEFAULT_QUESTIONS,
    buildStory: buildStoryForDefault,
    name: 'Стандартная игра',
    description: 'Классические вопросы игры',
  } satisfies QuestionMeta,
  'view-from-the-outside': {
    def: VIEW_FROM_THE_OUTSIDE_QUESTIONS,
    buildStory: buildStoryForViewFromTheOutside,
    name: 'Взгляд со стороны',
    description: 'Уникальная история, описывающая ситуацию для человека и взгляд на него со стороны',
  } satisfies QuestionMeta,
} as const;

export type QuestionsListKey = keyof typeof Question;
