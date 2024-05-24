'use server';

import { ReactNode } from 'react';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

import { createStreamableUI, createStreamableValue, getMutableAIState, streamUI } from 'ai/rsc';
import { nanoid } from 'nanoid';

import { VenueFull } from '@/lib/types';
import { runAsyncFnWithoutBlocking } from '@/lib/utils';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { SystemMessage } from '@/components/chat/Messages';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingPreviewCard } from '@/components/venue/BookingPreviewCard';
import { bookingService } from '..';
import { BookVenue } from '../bookingService/createBooking';
import { aiProvider } from './provider';
import { checkAvailabilityTool } from './tools/checkAvailability';
import { confirmBookingTool } from './tools/confirmBooking';
import { getNextAvailableDatesTool } from './tools/getNextAvailableDatesTool';
import { rscDemoTool } from './tools/rscDemo';
import { searchTool } from './tools/search';
import { viewDetailsTool } from './tools/viewDetails';
import { AIChat } from './types';
import {
  finalizeAIState,
  generateSystemMessage,
  generateSystemPrompt,
  generateUserMessage,
  updateAIState,
} from './utils';

export async function submitUserMessage(
  userInput: string,
  userMeta: { pathname: string; params: Params; currentTime: string }
): Promise<{ id: string; role: 'assistant'; display: ReactNode }> {
  const aiState = getMutableAIState<AIChat>();
  const user = getUserFromCookie();

  if (!user) {
    throw new Error('User not found');
  }

  updateAIState(aiState, [generateSystemMessage(userMeta, user), generateUserMessage(userInput)]);

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const result = await streamUI({
    model: aiProvider,
    messages: [
      ...aiState.get().messages,
      {
        role: 'user',
        content: userInput,
      },
    ],
    system: generateSystemPrompt(user),
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('');
        textNode = <SystemMessage message={textStream.value} needsSep />;
      }

      if (done) {
        textStream.done();
        finalizeAIState(aiState, [{ id: nanoid(), role: 'assistant', content }]);
      } else {
        textStream.update(delta);
      }

      return textNode;
    },
    tools: {
      rsc_demo: rscDemoTool(),
      search: searchTool(aiState),
      viewDetails: viewDetailsTool(aiState),
      confirmBooking: confirmBookingTool(aiState),
      checkAvailability: checkAvailabilityTool(aiState),
      getNextAvailableDates: getNextAvailableDatesTool(aiState),
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
