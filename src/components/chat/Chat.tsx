'use client';

import type { AIChat, UIState } from '@/lib/services/chatService/types';

import { RefObject, useRef, useState } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { useActions, useAIState, useUIState } from 'ai/rsc';
import { BotMessageSquareIcon, ChevronDownIcon } from 'lucide-react';
import { nanoid } from 'nanoid';

import { useScrollAnchor } from '@/lib/hooks/useScrollAnchor';
import { chatService } from '@/lib/services';
import { cn } from '@/lib/utils';
import { CookieUser } from '@/lib/utils/cookies';
import { Button } from '../ui/button';
import { Card, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { UserMessage } from './Messages';

export function Chat({ user }: { user: CookieUser }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-0 left-0 z-50 m-4 bg-sky-600 drop-shadow-sm hover:bg-sky-500"
      >
        <BotMessageSquareIcon />
        <span className="sr-only">Toggle Chat</span>
      </Button>
      {isOpen && <ChatWindow setIsOpen={setIsOpen} user={user} />}
    </>
  );
}

const ChatWindow = ({
  setIsOpen,
  user,
}: {
  setIsOpen: (isOpen: boolean) => void;
  user: CookieUser;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { submitUserMessage } = useActions<AIChat>();
  const [messages, setMessages] = useUIState<AIChat>();
  const [aiState] = useAIState();

  const [previousMessage, setPreviousMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } = useScrollAnchor();
  const params = useParams();
  const pathname = usePathname();

  const userMeta = {
    pathname,
    params,
    currentTime: new Date().toISOString(),
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nanoid(),
        role: 'user',
        display: <UserMessage message={inputValue} user={user} />,
      },
    ]);
    const responseMessage = await submitUserMessage(inputValue, userMeta);

    setMessages((currentMessages) => [...currentMessages, responseMessage]);

    setPreviousMessage(inputValue);
    setInputValue('');
    setIsLoading(false);
    scrollToBottom();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && previousMessage) {
      setInputValue(() => previousMessage);
    }
  };

  return (
    <>
      <Card className="fixed bottom-0 left-0 z-50 m-4 h-[600px] w-[28rem] max-w-full overflow-hidden rounded-lg border bg-white p-0 drop-shadow-sm">
        <ChatHeader setIsOpen={setIsOpen} />
        <Messages
          messages={messages}
          messagesRef={messagesRef}
          scrollRef={scrollRef}
          visibilityRef={visibilityRef}
        />
        {isLoading && <div>Loading...</div>}
        <ChatInput
          onSubmit={handleSubmit}
          isLoading={isLoading}
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputRef={inputRef}
          handleKeyDown={handleKeyDown}
          isAtBottom={isAtBottom}
          scrollToBottom={scrollToBottom}
        />
      </Card>
    </>
  );
};

const Messages = ({
  messages,
  messagesRef,
  scrollRef,
  visibilityRef,
}: {
  messages: UIState;
  messagesRef: RefObject<HTMLDivElement>;
  scrollRef: RefObject<HTMLDivElement>;
  visibilityRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <div className="h-[471px] overflow-auto" ref={scrollRef}>
      <div className="px-4 pb-2" ref={messagesRef}>
        <div className="maw-w-2xl relative mx-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <>{message.display}</>
            </div>
          ))}
        </div>
      </div>
      <div ref={visibilityRef} className="h-px w-full" />
    </div>
  );
};

const ChatHeader = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) => {
  return (
    <CardHeader className="border-b p-0">
      <div className="flex items-center justify-between px-2 py-2">
        <h2 className="text-sm font-bold ">Daizy Chat</h2>
        <Button
          variant="ghost"
          size="sm"
          className="aspect-square p-0"
          onClick={() => setIsOpen(false)}
        >
          <ChevronDownIcon />
        </Button>
      </div>
    </CardHeader>
  );
};

type ChatInputProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  setInputValue: (inputValue: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  isAtBottom: boolean;
  scrollToBottom: () => void;
};

const ChatInput = ({
  onSubmit,
  isLoading,
  inputValue,
  inputRef,
  setInputValue,
  handleKeyDown,
  isAtBottom,
  scrollToBottom,
}: ChatInputProps) => {
  return (
    <form
      className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 shadow-md"
      onSubmit={onSubmit}
    >
      <Button
        size="sm"
        variant="ghost"
        type="button"
        className={cn('absolute bottom-20 left-1/2 aspect-square -translate-x-1/2 p-0', {
          hidden: isAtBottom,
        })}
        onMouseDown={() => scrollToBottom()}
      >
        <ChevronDownIcon className="size-8" />
      </Button>
      <div className="flex gap-2">
        <Input
          disabled={isLoading}
          value={inputValue}
          placeholder="Write something..."
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full border"
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        <Button type="submit" disabled={inputValue.length < 1 || isLoading}>
          {isLoading ? 'Loading...' : 'Send'}
        </Button>
      </div>
    </form>
  );
};
