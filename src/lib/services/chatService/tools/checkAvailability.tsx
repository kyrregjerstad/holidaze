import { generateText } from 'ai';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { SystemMessage } from '@/components/chat/Messages';
import { Skeleton } from '@/components/ui/skeleton';
import { venueService } from '../..';
import { aiProvider } from '../provider';
import { MutableAIState, RenderTool } from '../types';
import { finalizeAIState, generateAssistantMessage, generateToolMessage } from '../utils';

export const checkAvailabilityTool = (aiState: MutableAIState): RenderTool<typeof schema> => ({
  description:
    'Check the availability of a venue. After checking, write a friendly message to the user with the details of the response.',
  parameters: schema,
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

    const toolCallId = nanoid();

    if (error) {
      finalizeAIState(aiState, [
        generateAssistantMessage([
          {
            type: 'tool-call',
            toolName: 'checkAvailability',
            toolCallId,
            args: parameters,
          },
        ]),
        generateToolMessage([
          {
            type: 'tool-result',
            toolName: 'checkAvailability',
            toolCallId,
            result: error,
            isError: true,
          },
        ]),
        generateAssistantMessage([
          {
            type: 'text',
            text: `An error occurred while checking the availability of the venue: ${error}`,
          },
        ]),
      ]);

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

    finalizeAIState(aiState, [
      generateAssistantMessage([
        {
          type: 'tool-call',
          toolName: 'checkAvailability',
          toolCallId,
          args: parameters,
        },
      ]),
      generateToolMessage([
        {
          type: 'tool-result',
          toolName: 'checkAvailability',
          toolCallId,
          result: available,
        },
      ]),
      generateAssistantMessage(text),
    ]);

    return <SystemMessage message={text} needsSep={true} />;
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
