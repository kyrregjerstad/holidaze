import { nanoid } from 'nanoid';
import { z } from 'zod';

import { SystemMessage } from '@/components/chat/Messages';
import { VenueDetailsCardChat } from '@/components/chat/VenueCardChat';
import { venueService } from '../..';
import { MutableAIState, RenderTool } from '../types';
import { finalizeAIState, generateAssistantMessage, generateToolMessage } from '../utils';

const schema = z.object({
  venueId: z.string(),
});

export const viewDetailsTool = (aiState: MutableAIState): RenderTool<typeof schema> => ({
  description: 'View details of a venue',
  parameters: z.object({ venueId: z.string() }),
  generate: async function* ({ venueId }) {
    const toolCallId = nanoid();

    const { venue } = await venueService.getVenueById(venueId);

    if (!venue) {
      const message = generateAssistantMessage(`I couldn't find the venue with id ${venueId}`);

      finalizeAIState(aiState, [message]);

      return <SystemMessage message={message} needsSep={true} />;
    }

    const assistantMessage = generateAssistantMessage([
      {
        type: 'text',
        text: `[showing the user a card with the details of the venue]`,
      },
      {
        type: 'tool-call',
        toolName: 'viewDetails',
        toolCallId,
        args: { venueId },
      },
    ]);

    const toolMessage = generateToolMessage([
      {
        type: 'tool-result',
        toolName: 'viewDetails',
        toolCallId,
        result: venue,
      },
    ]);

    finalizeAIState(aiState, [assistantMessage, toolMessage]);

    return (
      <div>
        <p className="py-2">Here are the details of the venue you selected.</p>
        <VenueDetailsCardChat venue={venue} />
      </div>
    );
  },
});
