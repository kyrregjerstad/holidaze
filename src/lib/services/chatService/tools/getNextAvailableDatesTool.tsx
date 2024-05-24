import { generateText } from 'ai';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { SystemMessage } from '@/components/chat/Messages';
import { Skeleton } from '@/components/ui/skeleton';
import { venueService } from '../..';
import { aiProvider } from '../provider';
import { MutableAIState, RenderTool } from '../types';
import { finalizeAIState, generateAssistantMessage, generateToolMessage } from '../utils';

export const getNextAvailableDatesTool = (aiState: MutableAIState): RenderTool<typeof schema> => ({
  description: 'Get the next available dates for a venue',
  parameters: schema,
  generate: async function* (parameters) {
    yield (
      <div>
        <Skeleton className="mb-2 h-4 w-full" />
        <p>Checking availability...</p>
      </div>
    );

    const { availableDate, venue, error } = await venueService.getNextAvailableDates(parameters);
    const toolCallId = nanoid();

    if (error) {
      finalizeAIState(aiState, [
        generateAssistantMessage([
          {
            type: 'tool-call',
            toolName: 'getNextAvailableDates',
            toolCallId,
            args: parameters,
          },
        ]),
        generateToolMessage([
          {
            type: 'tool-result',
            toolName: 'getNextAvailableDates',
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

    finalizeAIState(aiState, [
      generateAssistantMessage([
        {
          type: 'tool-call',
          toolName: 'getNextAvailableDates',
          toolCallId,
          args: parameters,
        },
      ]),
      generateToolMessage([
        {
          type: 'tool-result',
          toolName: 'getNextAvailableDates',
          toolCallId,
          result: availableDate,
        },
      ]),
      generateAssistantMessage(text),
    ]);

    return <SystemMessage message={text} needsSep={true} />;
  },
});

const schema = z.object({
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
});
