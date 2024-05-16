import { ReactNode } from 'react';

import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { SystemMessage } from '@/components/chat/Messages';
import { VenueDetailsCardChat } from '@/components/chat/VenueCardChat';
import { venueService } from '..';
import { aiProvider } from './provider';
import { searchTool } from './tools/search';

async function submitUserMessage(
  userInput: string
): Promise<{ id: string; role: 'assistant'; display: ReactNode }> {
  'use server';
  const history = getMutableAIState();

  history.update([...history.get(), { role: 'user', content: userInput }]);

  const result = await streamUI({
    model: aiProvider,
    messages: [...history.get(), { role: 'user', content: userInput }],
    system: systemMessage,
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

          console.log(venue);

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

type ServerMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type AIState = Array<{
  role: 'user' | 'assistant';
  content: string;
}>;

export const AIAction = createAI({
  initialAIState: [] as AIState,
  initialUIState,
  actions: {
    submitUserMessage,
  },
});

const systemMessage =
  'you are an assistant chatbot named Daizy to a page called Holidaze, where users can search for holiday homes from all over the world. You will help customers find the perfect holiday home and can also assist with booking it. Keep it casual and friendly.';

// test data for populating the chat

// const test = {
//   id: '60b5604c-ad99-45e7-bdf1-ef0c6c6f498f',
//   name: 'Viviano italia',
//   description: 'Heisannheisannheisann',
//   media: [
//     {
//       url: 'https://images.unsplash.com/photo-1615915017883-ff58d7e33b0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWlsYW5vJTIwaG91c2V8ZW58MHx8MHx8fDA%3D',
//       alt: 'image of venue',
//     },
//   ],
//   price: 200,
//   maxGuests: 4,
//   rating: 0,
//   created: '2024-05-15T09:12:46.128Z',
//   updated: '2024-05-15T09:12:46.128Z',
//   meta: { wifi: false, parking: true, breakfast: false, pets: false },
//   location: {
//     address: 'Formerveien ',
//     city: 'bergen',
//     zip: null,
//     country: 'norway',
//     continent: null,
//     lat: null,
//     lng: null,
//   },
//   owner: {
//     name: 'samsung',
//     email: 'samsung@stud.noroff.no',
//     bio: 'John Doe',
//     avatar: {
//       url: 'https://images.unsplash.com/photo-1715292779491-a32d1f086f5a?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//       alt: 'abstracqweqweqwe',
//     },
//     banner: {
//       url: 'https://images.unsplash.com/photo-1542779283-429940ce8336?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//       alt: 'pokemon image',
//     },
//   },
//   bookings: [],
// };
