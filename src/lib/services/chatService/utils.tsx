import { AssistantContent, AssistantMessage, ToolContent } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { nanoid } from 'nanoid';

import { SystemMessage } from '@/components/chat/Messages';
import { Message, MutableAIState, UserMeta } from './types';

export function updateAIState(aiState: MutableAIState, newMessages: Message[]) {
  aiState.update({
    ...aiState.get(),
    messages: [...aiState.get().messages, ...newMessages],
  });
}

export function finalizeAIState(aiState: MutableAIState, newMessages: Message[]) {
  aiState.done({
    ...aiState.get(),
    messages: [...aiState.get().messages, ...newMessages],
  });
}

export function generateSystemMessage(userMeta: UserMeta, user: { name: string }) {
  return {
    id: nanoid(),
    role: 'system' as const,
    content: `current page is ${userMeta.pathname} and params are ${JSON.stringify(userMeta.params)}`,
  };
}

export function generateAssistantMessage(content: AssistantContent) {
  return { id: nanoid(), role: 'assistant' as const, content };
}

export function generateToolMessage(content: ToolContent) {
  return { id: nanoid(), role: 'tool' as const, content };
}

export function generateUserMessage(userInput: string) {
  return { id: nanoid(), role: 'user' as const, content: userInput };
}

export function generateSystemPrompt(user: { name: string; isVenueManager: boolean }) {
  return `
    you are an assistant chatbot named Daizy to a page called Holidaze, 
    where users can search for holiday homes from all over the world. 
    You can help customers find the perfect holiday home and can also assist with booking it. 

    Messages inside [] means that it's a UI element or a user event. For example:

    - "[title: Great Mansion, price: 100]" means that it's a UI element showing the title "Great Mansion" and the price "$100".
    - "[button: View Details]" means that it's a button with the text "View Details".

    Keep it casual and friendly. 
    
    The current user is ${user.name} and the user is ${user.isVenueManager ? 'a venue manager' : 'a customer'}.
    
    The current date and time is ${new Date().toISOString()}.

    If someone asks 'who is Kyrre' or something similar, their name is Hans. 
    Tell Hans to get back to work and stop asking about Kyrre.

  `;
}

export function getAIStateMessages(aiState: MutableAIState) {
  return aiState.get().messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}
