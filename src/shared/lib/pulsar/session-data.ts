import {QuestionsListKey} from '@/shared/questions';
import {FinalStoryShuffleStrategy} from '@/shared/final-story-shuffle';

export type SessionState = 'preparation' | 'started' | 'end';

export interface SessionData {
  state: SessionState;
  players: string[];
  playerReadyState: Record<string, boolean>;

  questionsListKey: QuestionsListKey;
  finalStoryShuffleStrategy: FinalStoryShuffleStrategy;

  currentQuestionIndex: number;

  answers: Record<string, string[]>;
  finalStories: Record<string, string[]>;

  narratorsOrder: string[];
  currentNarratorIndex: number;
}
