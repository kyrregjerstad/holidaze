'use server';

import { createAI } from 'ai/rsc';
import { nanoid } from 'nanoid';

import { SystemMessage } from '@/components/chat/Messages';
import { submitUserMessage, userConfirmBooking } from './actions';
import { AIState, UIState } from './types';

const initialUIState: {
  id: string;
  role: 'user' | 'assistant';
  display: React.ReactNode;
}[] = [
  {
    id: nanoid(),
    role: 'assistant',
    display: (
      <SystemMessage
        message={`Hi, I'm Daizy! How can i help you find your perfect holiday home?`}
        needsSep={true}
      />
    ),
  },
];

export const AIcreator = createAI<
  AIState,
  UIState,
  { submitUserMessage: typeof submitUserMessage; userConfirmBooking: typeof userConfirmBooking }
>({
  actions: {
    submitUserMessage,
    userConfirmBooking,
  },
  initialUIState,
  initialAIState: { chatId: nanoid(), messages: [] },
});

export { AIcreator as AIProvider };
