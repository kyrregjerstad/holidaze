import type { ReactNode } from 'react';

import remarkGfm from 'remark-gfm';

import { Avatar, AvatarFallback } from '../ui/avatar';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { MemoizedReactMarkdown } from './Markdown';

export function SystemMessage(props: {
  message: string;
  needsSep: boolean;
  richMessage?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex gap-2 items-center">
        <Avatar className="size-6 bg-sky-400">
          <AvatarFallback className="text-md bg-sky-400">☀️</AvatarFallback>
        </Avatar>
        <span className="font-bold text-sm text-slate-900">Daizy</span>
      </div>
      {props.richMessage}
      <MemoizedReactMarkdown
        className="prose break-words prose-p:leading-relaxed prose-pre:p-0"
        remarkPlugins={[remarkGfm]}
        components={{
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside [&>li]:py-2 ">{children}</ol>;
          },
          li({ children }) {
            return <li className="mb-1 [&_p]:inline">{children}</li>;
          },
          hr() {
            return <hr className="border-slate-400 my-4 opacity-50" />;
          },
          blockquote({ children }) {
            return <blockquote className="bg-slate-100 p-2 mb-2">{children}</blockquote>;
          },
        }}
      >
        {props.message}
      </MemoizedReactMarkdown>
      {props.needsSep && <Separator />}
    </div>
  );
}

export function UserMessage(props: { message: string }) {
  return (
    <>
      <Card className="flex gap-2 py-3 p-2 max-w-[80%] w-fit self-end justify-self-end text-pretty bg-sky-400">
        <p>{props.message}</p>
        <Avatar className="size-6">
          <AvatarFallback className="text-xs">U</AvatarFallback>
        </Avatar>
      </Card>
    </>
  );
}
