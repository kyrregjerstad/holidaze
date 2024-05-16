import { createOpenAI } from '@ai-sdk/openai';

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('OPENAI_API_KEY is required');
}

const openai = createOpenAI({
  apiKey: API_KEY,
});

export const aiProvider = openai('gpt-4o');
