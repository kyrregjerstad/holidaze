'use client';

import type { AIChat } from '@/lib/services/chatService/types';

import { useState } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { useActions, useAIState, useUIState } from 'ai/rsc';
import { BotMessageSquareIcon, ChevronDownIcon } from 'lucide-react';
import { nanoid } from 'nanoid';

import { useScrollAnchor } from '@/lib/hooks/useScrollAnchor';
import { chatService } from '@/lib/services';
import { CookieUser } from '@/lib/utils/cookies';
import { Button } from '../ui/button';
import { Card, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { UserMessage } from './Messages';

export function Chat({ user }: { user: CookieUser }) {
  const [isOpen, setIsOpen] = useState(false);

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
      setInputValue(previousMessage);
    }
  };

  return (
    <>
      <Card className="fixed bottom-0 left-0 z-50 m-4 h-[600px] w-[28rem] max-w-full overflow-hidden rounded-lg border bg-white p-0 drop-shadow-sm">
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
        <div className="h-[475px] overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col gap-4 px-4 pb-10" ref={messagesRef}>
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                <>{message.display}</>
              </div>
            ))}
          </div>
          <div className="h-px w-full" ref={visibilityRef} />
        </div>
        {isLoading && <div>Loading...</div>}
        <ChatInput
          onSubmit={handleSubmit}
          isLoading={isLoading}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleKeyDown={handleKeyDown}
        />
      </Card>
    </>
  );
};

type ChatInputProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const ChatInput = ({
  onSubmit,
  isLoading,
  inputValue,
  setInputValue,
  handleKeyDown,
}: ChatInputProps) => {
  return (
    <form
      className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 shadow-md"
      onSubmit={onSubmit}
    >
      <div className="flex gap-2">
        <Input
          disabled={isLoading}
          value={inputValue}
          placeholder="Write something..."
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full border"
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" disabled={inputValue.length < 1 || isLoading}>
          {isLoading ? 'Loading...' : 'Send'}
        </Button>
      </div>
    </form>
  );
};
