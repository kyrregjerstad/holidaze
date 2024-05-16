import { getMutableAIState } from 'ai/rsc';

export type MutableAiState = ReturnType<typeof getMutableAIState>;
export type ServerMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type AIState = Array<{
  role: 'user' | 'assistant';
  content: string;
}>;
