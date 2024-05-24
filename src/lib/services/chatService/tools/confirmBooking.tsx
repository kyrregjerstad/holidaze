import { nanoid } from 'nanoid';
import { z } from 'zod';

import { SystemMessage } from '@/components/chat/Messages';
import {
  VenueConfirmBookingCardChat,
  VenueConfirmBookingCardChatSkeleton,
} from '@/components/chat/VenueConfirmBookingCardChat';
import { venueService } from '../..';
import { MutableAIState, RenderTool } from '../types';
import { finalizeAIState, generateAssistantMessage, generateToolMessage } from '../utils';

export const confirmBookingTool = (aiState: MutableAIState): RenderTool<typeof schema> => ({
  description: 'Create a confirm booking card with prefilled values and present it to the user',
  parameters: schema,
  generate: async function* (parameters) {
    yield <VenueConfirmBookingCardChatSkeleton />;
    const { venue } = await venueService.getVenueById(parameters.venueId);
    const toolCallId = nanoid();

    if (!venue) {
      finalizeAIState(aiState, [
        generateAssistantMessage([
          {
            type: 'tool-call',
            toolName: 'confirmBooking',
            toolCallId,
            args: parameters,
          },
        ]),
        generateToolMessage([
          {
            type: 'tool-result',
            toolName: 'confirmBooking',
            toolCallId,
            result: [],
          },
        ]),
        generateAssistantMessage([
          {
            type: 'text',
            text: `I couldn't find the venue with id ${parameters.venueId}`,
          },
        ]),
      ]);

      return (
        <SystemMessage
          message={`I couldn't find the venue with id ${parameters.venueId}`}
          needsSep={true}
        />
      );
    }

    finalizeAIState(aiState, [
      generateAssistantMessage([
        {
          type: 'tool-call',
          toolName: 'confirmBooking',
          toolCallId,
          args: parameters,
        },
      ]),
      generateToolMessage([
        {
          type: 'tool-result',
          toolName: 'confirmBooking',
          toolCallId,
          result: venue,
        },
      ]),
    ]);

    return <VenueConfirmBookingCardChat venue={venue} preSelectedValues={{ ...parameters }} />;
  },
});

const schema = z.object({
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
});
