import { nanoid } from 'nanoid';
import { z } from 'zod';

import { SystemMessage } from '@/components/chat/Messages';
import { VenueCardChat, VenueCardChatSkeleton } from '@/components/chat/VenueCardChat';
import { venueService } from '../..';
import { searchOptionsSchema } from '../../venueService/searchOptionsSchema';
import { MutableAIState, RenderTool } from '../types';
import { finalizeAIState, generateAssistantMessage, generateToolMessage } from '../utils';

export const searchTool = (aiState: MutableAIState): RenderTool<typeof searchOptionsSchema> => ({
  description: 'Search for holiday homes',
  parameters: searchOptionsSchema,
  generate: async function* (parameters: z.infer<typeof searchOptionsSchema>) {
    const toolCallId = nanoid();

    yield (
      <div className="grid grid-cols-2 gap-2">
        <VenueCardChatSkeleton />
        <VenueCardChatSkeleton />
      </div>
    );

    const { venues, error } = await venueService.search({ ...parameters, amount: 10 });

    if (error) {
      finalizeAIState(aiState, [
        generateAssistantMessage([
          {
            type: 'tool-call',
            toolName: 'search',
            toolCallId,
            args: { ...parameters },
          },
        ]),
        generateToolMessage([
          {
            type: 'tool-result',
            toolName: 'search',
            toolCallId,
            result: error,
            isError: true,
          },
        ]),
      ]);

      return (
        <SystemMessage
          message={`Sorry, there was an error while performing your search`}
          needsSep={true}
        />
      );
    }

    if (venues.length === 0) {
      finalizeAIState(aiState, [
        generateAssistantMessage([
          {
            type: 'tool-call',
            toolName: 'search',
            toolCallId,
            args: { ...parameters },
          },
        ]),
        generateToolMessage([
          {
            type: 'tool-result',
            toolName: 'search',
            toolCallId,
            result: [],
          },
        ]),
      ]);

      return (
        <SystemMessage
          message={`Sorry, I couldn't find any venues matching that criteria`}
          needsSep={true}
        />
      );
    }

    finalizeAIState(aiState, [
      generateAssistantMessage([
        {
          type: 'tool-call',
          toolName: 'search',
          toolCallId,
          args: { ...parameters },
        },
      ]),
      generateToolMessage([
        {
          type: 'tool-result',
          toolName: 'search',
          toolCallId,
          result: venues.map((venue) => ({
            venueId: venue.id,
            name: venue.name,
            city: venue.location.city,
            country: venue.location.country,
            price: venue.price,
          })),
        },
      ]),
    ]);

    return (
      <SystemMessage
        message={`I found ${venues.length} venues for you. Click on them to see more details.`}
        needsSep={true}
        richMessage={
          <div className="grid grid-cols-2 gap-2">
            {venues.map((venue) => (
              <VenueCardChat key={venue.id} venue={venue} />
            ))}
          </div>
        }
      />
    );
  },
});
