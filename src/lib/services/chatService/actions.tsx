'use server';

import { ReactNode } from 'react';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

import { CoreMessage, generateText } from 'ai';
import { createStreamableUI, createStreamableValue, getMutableAIState, streamUI } from 'ai/rsc';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { VenueFull } from '@/lib/types';
import { checkAvailability, runAsyncFnWithoutBlocking } from '@/lib/utils';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { SystemMessage } from '@/components/chat/Messages';
import { VenueDetailsCardChat } from '@/components/chat/VenueCardChat';
import {
  VenueConfirmBookingCardChat,
  VenueConfirmBookingCardChatSkeleton,
} from '@/components/chat/VenueConfirmBookingCardChat';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingPreviewCard } from '@/components/venue/BookingPreviewCard';
import { bookingService, venueService } from '..';
import { BookVenue } from '../bookingService/createBooking';
import { aiProvider } from './provider';
import { searchTool } from './tools/search';
import { AIChat } from './types';

export async function submitUserMessage(
  userInput: string,
  userMeta: { pathname: string; params: Params; currentTime: string }
): Promise<{ id: string; role: 'assistant'; display: ReactNode }> {
  const aiState = getMutableAIState<AIChat>();
  const user = getUserFromCookie();

  console.log(userMeta);

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
    
    The current user is ${user?.name} and the user is ${user?.isVenueManager ? 'a venue manager' : 'a customer'}.
    
    The current date and time is ${new Date().toISOString()}.
    `,
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
      confirmBooking: {
        description:
          'Create a confirm booking card with prefilled values and present it to the user',
        parameters: z.object({
          venueId: z.string(),
          startDate: z.coerce
            .date()
            .transform((dateString, ctx) => {
              const date = new Date(dateString);

              if (!z.date().safeParse(date).success) {
                ctx.addIssue({
                  code: z.ZodIssueCode.invalid_date,
                });
              }

              return date;
            })
            .optional()
            .describe('The date in the format YYYY-MM-DD'),
          endDate: z.coerce.date().transform((dateString, ctx) => {
            const date = new Date(dateString);

            if (!z.date().safeParse(date).success) {
              ctx.addIssue({
                code: z.ZodIssueCode.invalid_date,
              });
            }

            return date;
          }),
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
      checkAvailability: {
        description:
          'Check the availability of a venue. After checking, write a friendly message to the user with the details of the response.',
        parameters: z
          .object({
            venueId: z.string(),
            startDate: z.coerce
              .date()
              .transform((dateString, ctx) => {
                const date = new Date(dateString);

                if (!z.date().safeParse(date).success) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.invalid_date,
                  });
                }

                return date;
              })
              .describe('The date in the format YYYY-MM-DD'),
            endDate: z.coerce.date().transform((dateString, ctx) => {
              const date = new Date(dateString);

              if (!z.date().safeParse(date).success) {
                ctx.addIssue({
                  code: z.ZodIssueCode.invalid_date,
                });
              }

              return date;
            }),
            guests: z.number(),
          })
          .describe('The date in the format YYYY-MM-DD'),
        generate: async function* (parameters) {
          yield (
            <div>
              <Skeleton className="mb-2 h-4 w-full" />
              <p>Checking availability...</p>
            </div>
          );

          const { available, venue, error } = await venueService.checkAvailability({
            venueId: parameters.venueId,
            startDate: parameters.startDate,
            endDate: parameters.endDate,
          });

          if (error) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: `An error occurred while checking the availability of the venue: ${error}`,
                },
              ],
            });

            return (
              <SystemMessage
                message={`An error occurred while checking the availability of the venue: ${error}`}
                needsSep={true}
              />
            );
          }

          const prevMessages = aiState.get().messages;

          /* Providing generateText with the whole chat history makes it not respond... Why? */
          const { text } = await generateText({
            model: aiProvider,
            system: `You are a friendly assistant chatbot named Daizy to a page called Holidaze. 
            Reply to the users enquiry if the selected dates for a venue are available or not. 
            The venue is ${available ? 'available' : 'not available'}. 

            previous user message: ${prevMessages.at(-1)?.content}`,
            prompt: `Reply to the user if the selected dates for a venue are available or not. venue name: ${venue?.name}`,
          });

          const toolCallId = nanoid();
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'checkAvailability',
                    toolCallId,
                    args: parameters,
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'checkAvailability',
                    toolCallId,
                    result: available,
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'assistant',
                content: text,
              },
            ],
          });

          return <SystemMessage message={text} needsSep={true} />;
        },
      },
      getNextAvailableDates: {
        description: 'Get the next available dates for a venue',
        parameters: z.object({
          venueId: z.string().describe('The id of the venue'),
          startDate: z.coerce
            .date()
            .transform((dateString, ctx) => {
              const date = new Date(dateString);

              if (!z.date().safeParse(date).success) {
                ctx.addIssue({
                  code: z.ZodIssueCode.invalid_date,
                });
              }

              return date;
            })
            .describe('The date in the format YYYY-MM-DD'),
          days: z.number().describe('The number of days to check'),
        }),
        generate: async function* (parameters) {
          yield (
            <div>
              <Skeleton className="mb-2 h-4 w-full" />
              <p>Checking availability...</p>
            </div>
          );

          const { availableDate, venue, error } =
            await venueService.getNextAvailableDates(parameters);

          if (error) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: `An error occurred while checking the availability of the venue: ${error}`,
                },
              ],
            });

            return (
              <SystemMessage
                message={`An error occurred while checking the availability of the venue: ${error}`}
                needsSep={true}
              />
            );
          }

          const prevMessages = aiState.get().messages;

          const { text } = await generateText({
            model: aiProvider,
            system: `You are a friendly assistant chatbot named Daizy to a page called Holidaze. 
            Reply to the users enquiry with the available dates for a venue. 
            The available dates are from: ${availableDate?.from} to: ${availableDate?.to}.

            venue name: ${venue?.name}
            location: ${JSON.stringify(venue?.location)}

            previous user message: ${prevMessages.at(-1)?.content}`,
            prompt: `Reply to the user with the available dates for the venue.`,
          });

          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'getNextAvailableDates',
                    toolCallId,
                    args: parameters,
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'getNextAvailableDates',
                    toolCallId,
                    result: availableDate,
                  },
                ],
              },
              {
                id: nanoid(),
                role: 'assistant',
                content: text,
              },
            ],
          });

          return <SystemMessage message={text} needsSep={true} />;
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

export async function userConfirmBooking(venue: VenueFull, bookingData: BookVenue) {
  const aiState = getMutableAIState<AIChat>();

  const booking = createStreamableUI(
    <div>
      <Skeleton className="mb-2 h-4 w-1/2" />
      <p>Booking {venue.name}...</p>
    </div>
  );

  const systemMessage = createStreamableUI(null);

  runAsyncFnWithoutBlocking(async () => {
    booking.update(
      <div>
        <Skeleton className="mb-2 h-4 w-1/2" />
        <p>Booking {venue.name}... ...</p>
      </div>
    );

    const { booking: bookingRes, error, status } = await bookingService.createBooking(bookingData);

    booking.done(
      <div>
        <p className="py-4">
          You have successfully booked {venue.name}! Here are the booking details.
        </p>
      </div>
    );

    systemMessage.done(
      <SystemMessage
        richMessage={<BookingPreviewCard venue={venue} booking={bookingData} headerLink />}
        needsSep
      />
    );

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'system',
          content: `[user successfully created a booking at ${venue.name} from ]`,
        },
        {
          id: nanoid(),
          role: 'assistant',
          content: `Your booking at ${venue.name} has been confirmed. Enjoy your stay!`,
        },
      ],
    });
  });

  return {
    confirmationUI: booking.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value,
    },
  };
}
