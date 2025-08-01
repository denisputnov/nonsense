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

export type QuestionMeta = {
  def: QuestionDef[];
  name: string;
};

export const Question = {
  default: {
    def: DEFAULT_QUESTIONS,
    name: 'Стандартная игра',
  } satisfies QuestionMeta,
} as const;

export type QuestionsListKey = keyof typeof Question;
