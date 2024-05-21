'use client';

import type { ReactNode } from 'react';

import { StreamableValue } from 'ai/rsc';
import remarkGfm from 'remark-gfm';

import { useStreamableText } from '@/lib/hooks/useStreamableText';
import { CookieUser, getUserFromCookie } from '@/lib/utils/cookies';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { MemoizedReactMarkdown } from './Markdown';

export function SystemMessage(props: {
  message?: string | StreamableValue<string>;
  needsSep: boolean;
  richMessage?: ReactNode;
}) {
  const text = useStreamableText(props.message || '');

  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex items-center gap-2">
        <Avatar className="size-6 bg-sky-400">
          <AvatarFallback className="text-md bg-sky-400">☀️</AvatarFallback>
        </Avatar>
        <span className="text-sm text-neutral-500">Daizy</span>
      </div>
      {props.richMessage}
      <MemoizedReactMarkdown
        className="prose prose-p:leading-relaxed prose-pre:p-0 break-words"
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-inside list-disc">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-inside list-decimal [&>li]:py-2 ">{children}</ol>;
          },
          li({ children }) {
            return <li className="mb-1 [&_p]:inline">{children}</li>;
          },
          hr() {
            return <hr className="my-4 border-slate-400 opacity-50" />;
          },
          blockquote({ children }) {
            return <blockquote className="mb-2 bg-slate-100 p-2">{children}</blockquote>;
          },
        }}
      >
        {text}
      </MemoizedReactMarkdown>
      {props.needsSep && <Separator />}
    </div>
  );
}

export function UserMessage({ message, user }: { message: string; user: CookieUser }) {
  return (
    <>
      <Card className="flex w-fit max-w-[80%] flex-col gap-2 self-end justify-self-end text-pretty p-2 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-sm text-neutral-500">{user.name}</span>
          <Avatar className="size-6">
            <AvatarImage src={user.avatarUrl || undefined}></AvatarImage>
            <AvatarFallback className="text-xs">{user.name.at(0)}</AvatarFallback>
          </Avatar>
        </div>
        <p>{message}</p>
      </Card>
    </>
  );
}
