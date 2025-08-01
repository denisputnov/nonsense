import shuffle from 'lodash/shuffle';

const shuffleStrategy = (answers: Record<string, string[]>): Record<string, string[]> => {
  const entries = Object.entries(answers);

  const formatted = {} as Record<string, string[]>;

  const mapQuestionIndexToAllAnswers = {} as Record<string, string[]>;

  entries.forEach(([_, answers]) => {
    answers.forEach((answer, index) => {
      if (Array.isArray(mapQuestionIndexToAllAnswers[index])) {
        mapQuestionIndexToAllAnswers[index].push(answer);
      } else {
        mapQuestionIndexToAllAnswers[index] = [answer];
      }
    });
  });

  Object.keys(mapQuestionIndexToAllAnswers).forEach(key => {
    mapQuestionIndexToAllAnswers[key] = shuffle(mapQuestionIndexToAllAnswers[key]);
  });

  entries.forEach(([clientId, originalAnswers]) => {
    formatted[clientId] = [];

    originalAnswers.forEach((_, index) => {
      const randomQuestionForCurrentAnswerIndex = mapQuestionIndexToAllAnswers[index].shift();

      if (!randomQuestionForCurrentAnswerIndex) return;

      formatted[clientId][index] = randomQuestionForCurrentAnswerIndex;
    });
  });

  return formatted;
};

const nextStrategy = (answers: Record<string, string[]>): Record<string, string[]> => {
  const entries = Object.entries(answers);
  const playersCount = entries.length;

  const formatted = {} as Record<string, string[]>;

  entries.forEach(([clientId, answers], clientIndex) => {
    formatted[clientId] = [];

    answers.forEach((_, index) => {
      const target = entries[(clientIndex + index) % playersCount];
      const [, targetAnswers] = target;

      formatted[clientId][index] = targetAnswers[index];
    });
  });

  return formatted;
};

export type FinalStoryShuffleMeta = {
  callback: ({answers}: {answers: Record<string, string[]>}) => Record<string, string[]>;
  name: string;
};

export const FinalStoryShuffle = {
  next: {
    callback: ({answers}) => nextStrategy(answers),
    name: 'Один за другим',
  } satisfies FinalStoryShuffleMeta,
  shuffle: {
    callback: ({answers}) => shuffleStrategy(answers),
    name: 'В случайном порядке',
  } satisfies FinalStoryShuffleMeta,
} as const;

export type FinalStoryShuffleStrategy = keyof typeof FinalStoryShuffle;
