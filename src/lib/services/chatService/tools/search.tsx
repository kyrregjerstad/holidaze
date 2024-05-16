import { z } from 'zod';

import { SystemMessage } from '@/components/chat/Messages';
import { VenueCardChat, VenueCardChatSkeleton } from '@/components/chat/VenueCardChat';
import { venueService } from '../..';
import { searchOptionsSchema } from '../../venueService/searchOptionsSchema';
import { MutableAiState } from '../types';

export const searchTool = (history: MutableAiState) => ({
  description: 'Search for holiday homes',
  parameters: searchOptionsSchema,
  generate: async function* (parameters: z.infer<typeof searchOptionsSchema>) {
    yield (
      <div className="grid gap-2 grid-cols-2">
        <VenueCardChatSkeleton />
        <VenueCardChatSkeleton />
      </div>
    );

    const { venues, error } = await venueService.search({ ...parameters, amount: 10 });

    if (venues.length === 0) {
      history.done([
        ...history.get(),
        {
          role: 'assistant',
          content: `Sorry, I couldn't find any venues matching that criteria`,
        },
      ]);

      return (
        <SystemMessage
          message={`Sorry, I couldn't find any venues matching that criteria`}
          needsSep={true}
        />
      );
    }

    if (error) {
      history.done([
        ...history.get(),
        {
          role: 'assistant',
          content: `Sorry, there was an error while performing your search`,
        },
      ]);

      return (
        <SystemMessage
          message={`Sorry, there was an error while performing your search`}
          needsSep={true}
        />
      );
    }

    const content = venues.map((venue) => ({
      venueId: venue.id,
      name: venue.name,
      city: venue.location.city,
      country: venue.location.country,
      price: venue.price,
    }));

    history.done([
      ...history.get(),
      {
        role: 'assistant',
        content: `showing search result UI for the following venues: \n ${JSON.stringify(content)} `,
      },
    ]);

    return (
      <SystemMessage
        message={`I found ${venues.length} venues for you. Click on them to see more details.`}
        needsSep={true}
        richMessage={
          <div className="grid gap-2 grid-cols-2">
            {venues.map((venue) => (
              <VenueCardChat key={venue.id} venue={venue} />
            ))}
          </div>
        }
      />
    );
  },
});
