import {SessionData} from '@/shared/lib/pulsar/session-data';

export const DEFAULT_SESSION_STATE: SessionData = {
  finalStories: {},
  state: 'preparation',
  players: [],
  questionsListKey: 'default',
  currentQuestionIndex: 0,
  answers: {},
  playerReadyState: {},
  finalStoryShuffleStrategy: 'next',
  narratorsOrder: [],
  currentNarratorIndex: 0,
};

// export const DEFAULT_SESSION_STATE: SessionData = {
//   finalStories: {},
//   state: 'started',
//   players: ['f6a5cdcb-5b01-4754-b29a-e49f6839f801', '0a5c4012-6169-4cf5-879c-bc27c53a0adf'],
//   questionsListKey: 'default',
//   currentQuestionIndex: 8,
//   answers: {
//     'f6a5cdcb-5b01-4754-b29a-e49f6839f801': [
//       'Денис',
//       'С виталиком',
//       'Тогда',
//       'В вгу',
//       'Разговаривали',
//       'коровченко',
//       'Что-то сказал',
//       'Ага да',
//     ],
//     '0a5c4012-6169-4cf5-879c-bc27c53a0adf': [
//       'Вова',
//       'С алибабой',
//       'завтра',
//       'на работе',
//       'Шутили',
//       'марсианин',
//       'Привет чурки',
//       'привет',
//     ],
//   },
//   playerReadyState: {
//     'f6a5cdcb-5b01-4754-b29a-e49f6839f801': false,
//     '0a5c4012-6169-4cf5-879c-bc27c53a0adf': false,
//   },
//   finalStoryShuffleStrategy: 'next',
//   narratorsOrder: [],
//   currentNarratorIndex: 0,
// };
