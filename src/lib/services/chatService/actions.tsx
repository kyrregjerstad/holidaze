'use server';

import { ReactNode } from 'react';

import { getMutableAIState, streamUI } from 'ai/rsc';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { getUserFromCookie } from '@/lib/utils/cookies';
import { SystemMessage } from '@/components/chat/Messages';
import { VenueDetailsCardChat } from '@/components/chat/VenueCardChat';
import { venueService } from '..';
import { aiProvider } from './provider';
import { searchTool } from './tools/search';
import { ServerMessage } from './types';

export async function submitUserMessage(
  userInput: string
): Promise<{ id: string; role: 'assistant'; display: ReactNode }> {
  const history = getMutableAIState();
  const user = getUserFromCookie();

  history.update([...history.get(), { role: 'user', content: userInput }]);

  const result = await streamUI({
    model: aiProvider,
    messages: [...history.get(), { role: 'user', content: userInput }],
    system: `you are an assistant chatbot named Daizy to a page called Holidaze, 
    where users can search for holiday homes from all over the world. 
    You will help customers find the perfect holiday home and can also assist with booking it. 
    Keep it casual and friendly. The current user is ${user?.name} and the user is ${user?.isVenueManager ? 'a venue manager' : 'a customer'}.`,
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [...messages, { role: 'assistant', content }]);
      }

      return <SystemMessage message={content} needsSep={true} />;
    },
    tools: {
      rsc_demo: {
        description: `Call this function when the user types 'demo' this is for debugging`,
        parameters: z.object({}),
        generate: async function* () {
          yield <div>Testing 1...</div>;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          yield <div>Testing 2...</div>;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          yield <div>Testing 3...</div>;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return <div>Done!</div>;
        },
      },
      search: searchTool(history),
      viewDetails: {
        description: 'View details of a venue',
        parameters: z.object({ venueId: z.string() }),
        generate: async function* ({ venueId }) {
          console.log('venueId', venueId);
          const { venue } = await venueService.getVenueById(venueId);

          if (!venue) {
            history.done([
              ...history.get(),
              { role: 'assistant', content: `I couldn't find the venue with id ${venueId}` },
            ]);

            return (
              <SystemMessage
                message={`I couldn't find the venue with id ${venueId}`}
                needsSep={true}
              />
            );
          }

          history.done([
            ...history.get(),
            { role: 'assistant', content: `showing details of venue ${venue.name}` },
          ]);

          return (
            <div>
              <p className="py-2">Here are the details of the venue you selected.</p>

              <VenueDetailsCardChat venue={venue} />
            </div>
          );
        },
      },
    },
  });

  return {
    id: nanoid(),
    role: 'assistant',
    display: result.value,
  };
}

const systemMessage =
  'you are an assistant chatbot named Daizy to a page called Holidaze, where users can search for holiday homes from all over the world. You will help customers find the perfect holiday home and can also assist with booking it. Keep it casual and friendly.';
