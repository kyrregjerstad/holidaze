import { z } from 'zod';

import { RenderTool } from '../types';

export const rscDemoTool = (): RenderTool<typeof schema> => ({
  description: `Call this function when the user types 'demo' this is for debugging`,
  parameters: schema,
  generate: async function* () {
    yield <div>Testing 1...</div>;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield <div>Testing 2...</div>;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield <div>Testing 3...</div>;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return <div>Done!</div>;
  },
});

const schema = z.object({});
