import { CoreMessage } from 'ai';
import { getMutableAIState } from 'ai/rsc';

import { AIcreator } from './AIActions';

export type ServerMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type Message = CoreMessage & {
  id: string;
};

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = Array<{
  id: string;
  display: React.ReactNode;
}>;

export type AIChat = typeof AIcreator;
const aiState = getMutableAIState<AIChat>();

export type MutableAIState = typeof aiState;
