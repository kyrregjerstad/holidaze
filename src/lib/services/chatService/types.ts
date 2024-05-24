import { ReactNode } from 'react';

import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

import { CoreMessage } from 'ai';
import { getMutableAIState } from 'ai/rsc';
import { z } from 'zod';

import { AIcreator } from './AIActions';

export type Message = CoreMessage & {
  id: string;
};

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = Array<{
  id: string;
  display: React.ReactNode;
}>;

export type AIChat = typeof AIcreator;
const aiState = getMutableAIState<AIChat>();

export type MutableAIState = typeof aiState;

export type UserMeta = {
  pathname: string;
  params: Params;
  currentTime: string;
};

type Streamable = ReactNode | Promise<ReactNode>;
type Renderer<T extends Array<any>> = (
  ...args: T
) =>
  | Streamable
  | Generator<Streamable, Streamable, void>
  | AsyncGenerator<Streamable, Streamable, void>;
export type RenderTool<PARAMETERS extends z.ZodTypeAny = any> = {
  description?: string;
  parameters: PARAMETERS;
  generate?: Renderer<
    [
      z.infer<PARAMETERS>,
      {
        toolName: string;
        toolCallId: string;
      },
    ]
  >;
};
