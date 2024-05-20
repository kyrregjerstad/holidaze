'use server';

import { ReactNode } from 'react';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

import { createStreamableValue, getMutableAIState, streamUI } from 'ai/rsc';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { VenueFull } from '@/lib/types';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { SystemMessage } from '@/components/chat/Messages';
import { VenueDetailsCardChat } from '@/components/chat/VenueCardChat';
import {
  VenueConfirmBookingCardChat,
  VenueConfirmBookingCardChatSkeleton,
} from '@/components/chat/VenueConfirmBookingCardChat';
import { bookingService, venueService } from '..';
import { aiProvider } from './provider';
import { searchTool } from './tools/search';
import { AIChat } from './types';

export async function submitUserMessage(
  userInput: string,
  userMeta: { pathname: string; params: Params; currentTime: string }
): Promise<{ id: string; role: 'assistant'; display: ReactNode }> {
  const aiState = getMutableAIState<AIChat>();
  const user = getUserFromCookie();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'system',
        content: `current page is ${userMeta.pathname} and params are ${JSON.stringify(userMeta.params)}`,
      },
      { id: nanoid(), role: 'user', content: userInput },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const result = await streamUI({
    model: aiProvider,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    system: `\ 
    you are an assistant chatbot named Daizy to a page called Holidaze, 
    where users can search for holiday homes from all over the world. 
    You can help customers find the perfect holiday home and can also assist with booking it. 

    Messages inside [] means that it's a UI element or a user event. For example:

    - "[title: Great Mansion, price: 100]" means that it's a UI element showing the title "Great Mansion" and the price "$100".
    - "[button: View Details]" means that it's a button with the text "View Details".

    Keep it casual and friendly. 
    
    The current user is ${user?.name} and the user is ${user?.isVenueManager ? 'a venue manager' : 'a customer'}.`,
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('');
        textNode = <SystemMessage message={textStream.value} needsSep />;
      }

      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content,
            },
          ],
        });
      } else {
        textStream.update(delta);
      }

      return textNode;
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
      search: searchTool(aiState),
      viewDetails: {
        description: 'View details of a venue',
        parameters: z.object({ venueId: z.string() }),
        generate: async function* ({ venueId }) {
          console.log('venueId', venueId);
          const toolCallId = nanoid();

          const { venue } = await venueService.getVenueById(venueId);

          if (!venue) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: `I couldn't find the venue with id ${venueId}`,
                },
              ],
            });

            return (
              <SystemMessage
                message={`I couldn't find the venue with id ${venueId}`}
                needsSep={true}
              />
            );
          }

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  { type: 'tool-call', toolName: 'viewDetails', toolCallId, args: { venueId } },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'viewDetails',
                    toolCallId,
                    result: venue,
                  },
                ],
              },
            ],
          });

          return (
            <div>
              <p className="py-2">Here are the details of the venue you selected.</p>
              <VenueDetailsCardChat venue={venue} />
            </div>
          );
        },
      },
      // bookVenue: {
      //   description: 'Book a venue',
      //   parameters: z.object({
      //     venueId: z.string(),
      //     dateFrom: z.string().describe('Date in the format YYYY-MM-DD'),
      //     dateTo: z.string().describe('Date in the format YYYY-MM-DD'),
      //     guests: z.number(),
      //   }),
      //   generate: async function* (parameters) {
      //     const toolCallId = nanoid();

      //     const { venue } = await venueService.getVenueById(parameters.venueId);

      //     if (!venue) {
      //       aiState.done({
      //         ...aiState.get(),
      //         messages: [
      //           ...aiState.get().messages,
      //           {
      //             id: nanoid(),
      //             role: 'assistant',
      //             content: `I couldn't find the venue with id ${parameters.venueId}`,
      //           },
      //         ],
      //       });

      //       return (
      //         <SystemMessage
      //           message={`I couldn't find the venue with id ${parameters.venueId}`}
      //           needsSep={true}
      //         />
      //       );
      //     }

      //     console.log(parameters);

      //     const { booking, error } = await bookingService.createBooking(parameters);

      //     console.log('booking', booking);
      //     console.log('error', error);

      //     if (error || !booking) {
      //       aiState.done({
      //         ...aiState.get(),
      //         messages: [
      //           ...aiState.get().messages,
      //           {
      //             id: nanoid(),
      //             role: 'assistant',
      //             content: [
      //               { type: 'tool-call', toolName: 'bookVenue', toolCallId, args: parameters },
      //             ],
      //           },
      //           {
      //             id: nanoid(),
      //             role: 'tool',
      //             content: [
      //               {
      //                 type: 'tool-result',
      //                 toolName: 'bookVenue',
      //                 toolCallId,
      //                 result: [],
      //               },
      //             ],
      //           },

      //           {
      //             id: nanoid(),
      //             role: 'assistant',
      //             content: `I couldn't book the venue with id ${parameters.venueId}`,
      //           },
      //         ],
      //       });

      //       return (
      //         <SystemMessage
      //           message={`I couldn't book the venue with id ${parameters.venueId}`}
      //           needsSep={true}
      //         />
      //       );
      //     }

      //     aiState.done({
      //       ...aiState.get(),
      //       messages: [
      //         ...aiState.get().messages,
      //         {
      //           id: nanoid(),
      //           role: 'assistant',
      //           content: [
      //             { type: 'tool-call', toolName: 'bookVenue', toolCallId, args: parameters },
      //           ],
      //         },
      //         {
      //           id: nanoid(),
      //           role: 'tool',
      //           content: [
      //             {
      //               type: 'tool-result',
      //               toolName: 'bookVenue',
      //               toolCallId,
      //               result: booking,
      //             },
      //           ],
      //         },
      //       ],
      //     });

      //     return (
      //       <div>
      //         <p>
      //           Congratulations! You have successfully booked the venue. Here are the booking
      //           details.
      //         </p>
      //         <p>
      //           <strong>Booking ID:</strong> {booking.id}
      //         </p>
      //         <p>
      //           <strong>Date from: </strong> {booking.dateFrom}
      //         </p>
      //         <p>
      //           <strong>Date to: </strong> {booking.dateTo}
      //         </p>
      //         <p>
      //           <strong>Guests: </strong> {booking.guests}
      //         </p>
      //       </div>
      //     );
      //   },
      // },
      confirmBooking: {
        description:
          'Create a confirm booking card with prefilled values and present it to the user',
        parameters: z.object({
          venueId: z.string(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          guests: z.number(),
        }),
        generate: async function* (parameters) {
          yield <VenueConfirmBookingCardChatSkeleton />;
          const { venue } = await venueService.getVenueById(parameters.venueId);
          const toolCallId = nanoid();

          if (!venue) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    { type: 'tool-call', toolName: 'confirmBooking', toolCallId, args: parameters },
                  ],
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'confirmBooking',
                      toolCallId,
                      result: [],
                    },
                  ],
                },
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: `I couldn't find the venue with id ${parameters.venueId}`,
                },
              ],
            });

            return (
              <SystemMessage
                message={`I couldn't find the venue with id ${parameters.venueId}`}
                needsSep={true}
              />
            );
          }

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  { type: 'tool-call', toolName: 'confirmBooking', toolCallId, args: parameters },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'confirmBooking',
                    toolCallId,
                    result: venue,
                  },
                ],
              },
            ],
          });

          return (
            <VenueConfirmBookingCardChat venue={venue} preSelectedValues={{ ...parameters }} />
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

// export async function userConfirmBooking(venue: VenueFull) {
//   const aiState = getMutableAIState<AIChat>();

//   aiState.update({
//     ...aiState.get(),
//     messages: [
//       ...aiState.get().messages,
//       {
//         id: nanoid(),
//         role: 'user',
//         content: `[user confirmed their booking at ${venue.name} ]`,
//       },
//     ],
//   });

//   return {
//     id: nanoid(),
//     role: 'assistant',
//     display: <SystemMessage message="Please confirm your booking" needsSep />,
//   };
// }
